export default function StarDisplay({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? 'var(--color-amber-mid)' : '#d9d4ce', fontSize: 16 }}>
          ★
        </span>
      ))}
    </span>
  )
}
