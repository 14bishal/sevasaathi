'use client'

import { useState, useEffect } from 'react'
import { registerWorker } from '@/lib/services/api'
import { INITIAL_FORM } from '@/lib/constants'
import InputField, { inputStyle, focusBorder, blurBorder } from '@/components/common/InputField'
import CreatableSelect from 'react-select/creatable'
import { usePincode } from '@/hooks/usePincode'
import TradeSelect from '@/components/TradeSelect'

interface FormData {
  name: string
  phone: string
  whatsapp: string
  trade: string
  city: string
  state: string
  area: string
  pincode: string
  experience: string
  bio: string
}

interface FieldErrors {
  [key: string]: string[] | undefined
}

interface RegisterFormProps {
  onSuccess: (data: { profileUrl: string; phone: string }) => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  // const [isMounted, setIsMounted] = useState(false)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})

  const { data: pincodeData, loading: pincodeLoading, error: pincodeError } = usePincode(form.pincode)
  console.log('pincodeData', pincodeData);


  useEffect(() => {
    if (pincodeData) {
      setForm(prev => ({ ...prev, city: pincodeData.city, state: pincodeData.state }))
      setErrors(prev => ({ ...prev, city: undefined, state: undefined }))
    } else {
      setForm(prev => ({ ...prev, city: '', state: '' }))
    }
  }, [pincodeData])

  // useEffect(() => {
  //   setIsMounted(true)
  // }, [])
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  function update(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    setErrors({})
    setSubmitting(true)

    // Basic client-side validation
    const newErrors: FieldErrors = {}
    if (form.name.trim().length < 2) newErrors.name = ['Name must be at least 2 characters.']
    if (!/^[6-9]\d{9}$/.test(form.phone)) newErrors.phone = ['Enter a valid 10-digit Indian mobile number.']
    if (form.whatsapp && !/^[6-9]\d{9}$/.test(form.whatsapp)) newErrors.whatsapp = ['Enter a valid 10-digit number.']
    if (!form.trade) newErrors.trade = ['Please select your trade.']
    if (form.city.trim().length < 2) newErrors.city = ['City is required.']
    if (form.area.trim().length < 2) newErrors.area = ['Area is required.']
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) newErrors.pincode = ['Enter a valid 6-digit pincode.']
    if (!form.experience) newErrors.experience = ['Enter years of experience.']
    else if (Number(form.experience) < 0 || Number(form.experience) > 50) newErrors.experience = ['Experience must be between 0 and 50.']

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSubmitting(false)
      return
    }

    console.log('form', { form })

    try {
      const data = await registerWorker({
        name: form.name.trim(),
        phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        trade: form.trade,
        city: form.city.trim(),
        state: form.state.trim(),
        area: form.area.trim(),
        pincode: form.pincode || undefined,
        experience: Number(form.experience),
        bio: form.bio.trim() || undefined,
      })

      onSuccess({ profileUrl: data.profileUrl, phone: form.phone })
    } catch (error: any) {
      if (error?.data?.error && typeof error.data.error === 'object') {
        setErrors(error.data.error)
      } else {
        setServerError(error?.data?.error || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 sm:p-8 space-y-5"
      style={{ boxShadow: 'var(--shadow-card)' }}
      noValidate
      aria-label="Worker registration form"
    >
      {/* Personal details section */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--color-charcoal-60)' }}>
          Personal Details
        </h2>
        <div className="space-y-4">
          <InputField id="name" label="Full Name" required error={errors.name?.[0]}>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="e.g. Ramesh Kumar"
              maxLength={60}
              autoComplete="name"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors"
              style={inputStyle(!!errors.name)}
              onFocus={focusBorder}
              onBlur={(e) => blurBorder(e, !!errors.name)}
            />
          </InputField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="phone" label="Mobile Number" required hint="(10 digits)" error={errors.phone?.[0]}>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="9876543210"
                maxLength={10}
                autoComplete="tel"
                inputMode="numeric"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                style={inputStyle(!!errors.phone)}
                onFocus={focusBorder}
                onBlur={(e) => blurBorder(e, !!errors.phone)}
              />
            </InputField>

            <InputField id="whatsapp" label="WhatsApp Number" hint="(optional)" error={errors.whatsapp?.[0]}>
              <input
                id="whatsapp"
                type="tel"
                value={form.whatsapp}
                onChange={update('whatsapp')}
                placeholder="If different from mobile"
                maxLength={10}
                inputMode="numeric"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                style={inputStyle(!!errors.whatsapp)}
                onFocus={focusBorder}
                onBlur={(e) => blurBorder(e, !!errors.whatsapp)}
              />
            </InputField>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: '#f0ede9' }} />

      {/* Trade details section */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--color-charcoal-60)' }}>
          Trade Details
        </h2>
        <div className="space-y-4">
          <InputField id="trade" label="Your Trade" required error={errors.trade?.[0]}>
            <TradeSelect value={form.trade} errors={errors} onChange={(value) => {
              setForm(prev => ({ ...prev, trade: value }))
              setErrors(prev => ({ ...prev, trade: undefined }))
            }} />
          </InputField>

          <InputField id="experience" label="Years of Experience" required error={errors.experience?.[0]}>
            <input
              id="experience"
              type="number"
              value={form.experience}
              onChange={update('experience')}
              placeholder="e.g. 5"
              min={0}
              max={50}
              inputMode="numeric"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors"
              style={inputStyle(!!errors.experience)}
              onFocus={focusBorder}
              onBlur={(e) => blurBorder(e, !!errors.experience)}
            />
          </InputField>

          <InputField id="bio" label="About You" hint="(optional, max 300 chars)" error={errors.bio?.[0]}>
            <textarea
              id="bio"
              value={form.bio}
              onChange={update('bio')}
              placeholder="Describe your work — what you specialise in, how fast you respond, etc."
              maxLength={300}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors resize-none"
              style={inputStyle(!!errors.bio)}
              onFocus={focusBorder}
              onBlur={(e) => blurBorder(e, !!errors.bio)}
            />
            <div className="text-right text-xs mt-0.5" style={{ color: 'var(--color-charcoal-60)' }}>
              {form.bio.length}/300
            </div>
          </InputField>
        </div>
      </div>

      <hr style={{ borderColor: '#f0ede9' }} />

      {/* Location section */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--color-charcoal-60)' }}>
          Location
        </h2>
        <div className="space-y-4">
          <InputField id="pincode" label="Pincode" required error={errors.pincode?.[0] || pincodeError || undefined}>
            <div className="relative">
              <input
                id="pincode"
                type="text"
                value={form.pincode}
                onChange={update('pincode')}
                placeholder="e.g. 110024"
                maxLength={6}
                inputMode="numeric"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                style={inputStyle(!!errors.pincode || !!pincodeError)}
                onFocus={focusBorder}
                onBlur={(e) => blurBorder(e, !!errors.pincode || !!pincodeError)}
              />
              {pincodeLoading && (
                <span className="absolute right-3 top-3 text-xs font-semibold animate-pulse" style={{ color: 'var(--color-amber-dark)' }}>
                  Fetching...
                </span>
              )}
            </div>
          </InputField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField id="state" label="State" required error={errors.state?.[0]}>
              <input
                id="state"
                type="text"
                value={form.state}
                disabled
                placeholder="Auto-filled via Pincode"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none cursor-not-allowed"
                style={{ borderColor: '#e8e4df', backgroundColor: '#f9fafb', color: 'var(--color-charcoal-60)' }}
              />
            </InputField>

            <InputField id="city" label="City / District" required error={errors.city?.[0]}>
              <input
                id="city"
                type="text"
                value={form.city}
                disabled
                placeholder="Auto-filled via Pincode"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none cursor-not-allowed"
                style={{ borderColor: '#e8e4df', backgroundColor: '#f9fafb', color: 'var(--color-charcoal-60)' }}
              />
            </InputField>
          </div>

          <InputField id="area" label="Landmark / Area / Road" required error={errors.area?.[0]}>
            <input
              id="area"
              type="text"
              value={form.area}
              onChange={update('area')}
              placeholder="e.g. Lajpat Nagar"
              maxLength={80}
              autoComplete="address-level1"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors"
              style={inputStyle(!!errors.area)}
              onFocus={focusBorder}
              onBlur={(e) => blurBorder(e, !!errors.area)}
            />
          </InputField>
        </div>
      </div>

      {serverError && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
          role="alert"
        >
          {serverError}
        </div>
      )}

      <button
        type="submit"
        id="register-submit-btn"
        disabled={submitting}
        className="w-full py-4 rounded-xl font-bold text-base transition-all disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
        style={{
          backgroundColor: 'var(--color-amber-mid)',
          color: 'var(--color-amber-dark)',
          boxShadow: 'var(--shadow-button)',
        }}
      >
        {submitting ? 'Creating your profile…' : 'Create My Free Profile 🚀'}
      </button>

      <p className="text-xs text-center" style={{ color: 'var(--color-charcoal-60)' }}>
        By registering, you agree to Madad&apos;s terms. Your profile will be publicly visible on Google.
      </p>
    </form>
  )
}
