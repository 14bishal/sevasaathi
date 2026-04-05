import Link from 'next/link'

interface FooterProps {
  className?: string
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`border-t py-6 text-center text-sm ${className}`} style={{ borderColor: '#e8e4df', color: 'var(--color-charcoal-60)' }}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2">
        <Link href="/" className="font-bold sm:hidden" style={{ color: 'var(--color-amber-dark)' }}>Sevasaathi</Link>
        <span>© 2026 Sevasaathi. Connecting India's skilled workers.</span>
        <div className="flex items-center gap-4">
          {/* <Link href="/dashboard" className="hover:opacity-70 transition-opacity">Dashboard</Link> */}
        </div>
      </div>
    </footer>
  )
}
