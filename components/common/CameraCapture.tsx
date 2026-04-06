'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'

interface CameraCaptureProps {
  onCapture: (file: File, previewUrl: string) => void;
  onError?: (error: string) => void;
  maxDimension?: number;
  quality?: number; // 0 to 1
}

export default function CameraCapture({
  onCapture,
  onError,
  maxDimension = 800,
  quality = 0.8
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [isCapturing, setIsCapturing] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const isStartingRef = useRef(false)

  const startCamera = async () => {
    if (isStartingRef.current || streamRef.current) return;
    isStartingRef.current = true;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      streamRef.current = mediaStream
      setIsCapturing(true);
      setPreview(null);
    } catch (err) {
      console.error('Error accessing camera:', err)
      const errString = err instanceof Error ? err.message : String(err)
      onError?.(`Could not access the camera. Make sure you've granted permissions. (${errString})`)
    } finally {
      isStartingRef.current = false;
    }
  }

  const stopCamera = useCallback(() => {
    // 1. Stop tracks from the ref
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 2. Deep fallback: forcibly stop any tracks currently bound to the video element
    if (videoRef.current && videoRef.current.srcObject) {
      const attachedStream = videoRef.current.srcObject as MediaStream;
      attachedStream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsCapturing(false)
  }, [])

  const retake = () => {
    setPreview(null);
    streamRef.current = null;
    setIsCapturing(false);
    startCamera();
  }

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Calculate new dimensions while keeping aspect ratio
    let width = video.videoWidth || video.clientWidth;
    let height = video.videoHeight || video.clientHeight;

    if (!width || !height) {
      onError?.('Camera stream is not fully ready yet. Please try again in a moment.');
      return
    }

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return

    // If the front camera is mirrored, we might want to mirror back so it's recorded correctly.
    // However, usually we want to save it as the user saw it (mirrored).
    ctx.translate(width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video, 0, 0, width, height);

    // Convert to highly compressed JPEG (WebP is unreliable on some mobile browsers)
    canvas.toBlob((blob) => {
      if (!blob) {
        onError?.('Failed to compress image. Please try again.');
        return
      }
      stopCamera();
      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl);

      const file = new File([blob], 'profile.jpeg', { type: 'image/jpeg' });
      onCapture(file, previewUrl);
    }, 'image/jpeg', quality)
  }

  // Cleanup camera stream strictly on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [])

  // Safely assign stream to video element when it mounts
  useEffect(() => {
    if (isCapturing && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [isCapturing])

  return (
    <div className="w-full flex justify-center py-2">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* State 1: Idle - waiting to start camera */}
      {!isCapturing && !preview && (
        <div
          onClick={startCamera}
          className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-amber-400 transition-colors group"
        >
          <div className="text-center text-sm text-gray-500 group-hover:text-amber-600 transition-colors">
            <svg className="w-8 h-8 mx-auto text-gray-400 group-hover:text-amber-500 mb-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Add Profile Photo
          </div>
        </div>
      )}

      {/* State 2: Camera active - snapping picture */}
      {isCapturing && (
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-amber-500 bg-black shadow-lg">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
            autoPlay
            playsInline
            muted
          />
          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <button
              type="button"
              onClick={capture}
              className="bg-white text-black px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform font-bold text-sm tracking-wide z-10"
              style={{ color: 'var(--color-amber-dark)' }}
            >
              Capture
            </button>
          </div>
        </div>
      )}

      {/* State 3: Picture taken - showing preview */}
      {preview && (
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-green-500 bg-gray-100 shadow-md">
            <img src={preview} alt="Captured Profile" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={retake}
            className="text-sm font-semibold hover:underline"
            style={{ color: 'var(--color-charcoal-60)' }}
          >
            Retake Photo
          </button>
        </div>
      )}
    </div>
  )
}
