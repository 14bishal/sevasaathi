'use client'

import React from "react"

interface Props {
    phone: string
    fullUrl: string
}

export default function WhatsAppShareButton({ phone, fullUrl }: Props) {
    const message = [
        'Namaste! Your Sevasaathi profile is ready.',
        '',
        'View your profile:',
        fullUrl,
        '',
        'Share this link with customers \u2014 they can call you directly from there!'
    ].join('\n')

    return (
        <a
            href={`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`}
            id="share-whatsapp-btn"
            className="block w-full py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{
                backgroundColor: 'var(--color-teal-light)',
                color: 'var(--color-teal-dark)',
                border: '1.5px solid var(--color-teal-mid)'
            }}
            target="_blank"
            rel="noopener noreferrer"
        >
            Send to My WhatsApp
            < img
                src="https://img.icons8.com/?size=100&id=16713&format=png&color=085041"
                width={20}
                height={20}
                alt="whatsapp"
            />
        </a >
    )
}