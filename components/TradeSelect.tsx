'use client'

import { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { formatTradeDisplay, formatTradeSlug } from '@/lib/trade'

interface Option {
    value: string   // lowercase slug — "teacher"
    label: string   // display name — "Teacher"
}

interface FieldErrors {
    [key: string]: string[] | undefined
}

interface Props {
    value: string
    onChange: (value: string) => void  // always returns lowercase slug
    errors: FieldErrors
}

export default function TradeSelect({ value, onChange, errors }: Props) {
    const [options, setOptions] = useState<Option[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)

    // Fetch all existing trades on mount
    useEffect(() => {
        async function loadTrades() {
            try {
                const res = await fetch('/api/trades')
                const data = await res.json()
                setOptions(toOptions(data.trades))
            } catch (e) {
                console.error('Failed to load trades')
            } finally {
                setIsLoading(false)
            }
        }
        loadTrades()
    }, []);


    function toOptions(trades: string[]): Option[] {
        return trades.map(t => ({
            value: t,                    // "teacher" — what gets saved
            label: formatTradeDisplay(t) // "Teacher" — what user sees
        }))
    }

    // Called when user selects an existing option
    function handleChange(option: Option | null) {
        if (!option) { onChange(''); return }
        onChange(option.value)
    }

    // Called when user types a new trade and hits enter
    async function handleCreate(inputValue: string) {
        const slug = formatTradeSlug(inputValue)

        if (!slug || slug.length < 2) return

        const alreadyExists = options.find(o => o.value === slug)
        if (alreadyExists) {
            onChange(slug)  // just select the existing one
            return
        }

        setIsCreating(true)

        try {
            // Save new trade to DB
            await fetch('/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: slug })
            })

            // Add to local options list
            const newOption: Option = {
                value: slug,
                label: formatTradeDisplay(slug)
            }

            setOptions(prev => [...prev, newOption].sort((a, b) =>
                a.label.localeCompare(b.label)
            ))

            // Set as selected value
            onChange(slug)

        } catch (e) {
            console.error('Failed to create trade')
        } finally {
            setIsCreating(false)
        }
    }

    // Current selected value as Option object
    const selectedOption = value
        ? { value, label: formatTradeDisplay(value) }
        : null

    return (
        <CreatableSelect
            id="trade"
            instanceId="trade-select"
            placeholder="Select or type your trade…"
            options={options}
            value={selectedOption}
            onChange={handleChange}
            onCreateOption={handleCreate}
            isLoading={isLoading || isCreating}
            isDisabled={isCreating}
            formatCreateLabel={(input) =>
                `Add "${formatTradeDisplay(formatTradeSlug(input))}"`
            }
            menuPortalTarget={document.body}
            styles={{
                control: (base, state) => ({
                    ...base,
                    borderRadius: '0.75rem', /* rounded-xl */
                    padding: '0.125rem',
                    borderColor: errors.trade ? '#ef4444' : state.isFocused ? 'var(--color-amber-mid)' : '#d9d4ce',
                    boxShadow: 'none',
                    '&:hover': {
                        borderColor: errors.trade ? '#ef4444' : 'var(--color-amber-mid)',
                    },
                    backgroundColor: 'white',
                    color: 'var(--color-charcoal)',
                    fontSize: '0.875rem',
                }),
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                menu: base => ({
                    ...base,
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    zIndex: 9999
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? 'var(--color-amber-mid)' : state.isFocused ? 'var(--color-amber-light)' : 'transparent',
                    color: state.isSelected ? 'var(--color-amber-dark)' : 'var(--color-charcoal)',
                    '&:active': {
                        backgroundColor: 'var(--color-amber-mid)'
                    }
                })
            }}
        />
    )

}