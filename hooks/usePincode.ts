import { useState, useEffect } from 'react'

export interface PincodeData {
  city: string
  state: string
}

export function usePincode(pincode: string) {
  const [data, setData] = useState<PincodeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Exact 6 digits validation
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setData(null)
      if (pincode.length > 0 && pincode.length !== 6) {
        setError('Pincode must be exactly 6 digits')
      } else {
        setError(null)
      }
      return
    }

    const fetchPincode = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        const json = await response.json()

        if (json && json[0] && json[0].Status === 'Success' && json[0].PostOffice && json[0].PostOffice.length > 0) {
          const po = json[0].PostOffice[0]

          // Combine Block and District per user requirement
          const cityString = po?.Block && po?.Block !== 'NA'
            ? `${po?.Block}, ${po?.District}`
            : po?.District

          setData({
            city: cityString,
            state: po?.State
          })
        } else {
          setError('Invalid Pincode')
          setData(null)
        }
      } catch (err) {
        setError('Network error while validating pincode')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    // Debounce API calls by 500ms
    const timeoutId = setTimeout(fetchPincode, 500)
    return () => clearTimeout(timeoutId)

  }, [pincode])

  return { data, loading, error }
}
