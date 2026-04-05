import Link from 'next/link'

interface HeaderProps {
  rightNode?: React.ReactNode
  variant?: 'transparent' | 'solid'
}

export default function Header({ rightNode, variant = 'solid' }: HeaderProps) {
  return (
    <header 
      className={`sticky top-0 z-30 border-b ${variant === 'transparent' ? 'bg-white/80 backdrop-blur' : 'bg-white'}`} 
      style={{ borderColor: '#e8e4df' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-amber-dark)' }}>
          Madad
        </Link>
        {rightNode && (
          <nav className="flex items-center gap-3">
            {rightNode}
          </nav>
        )}
      </div>
    </header>
  )
}
