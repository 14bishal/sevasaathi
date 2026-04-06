import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Trade, WorkerWithReviews } from '@/lib/types'
import { getTradeLabel } from '@/lib/constants'
import { formatTradeUrl } from '@/lib/trade'
import ContactButtons from '@/components/ContactButtons'
import ReviewForm from '@/components/ReviewForm'
import ReviewList from '@/components/ReviewList'
import StarDisplay from '@/components/common/StarDisplay'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

interface PageProps {
  params: Promise<{ city: string; trade: string; slug: string }>
}

async function getWorker(slug: string): Promise<WorkerWithReviews | null> {
  const { data, error } = await supabase
    .from('workers')
    .select('*, reviews(*)')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return null
  return data as WorkerWithReviews
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const worker = await getWorker(slug)
  if (!worker) return { title: 'Worker not found' }

  const tradeLabel = getTradeLabel(worker.trade)
  const cityFormatted = worker.city.charAt(0).toUpperCase() + worker.city.slice(1)

  return {
    title: `${worker.name} — ${tradeLabel} in ${worker.area}, ${cityFormatted}`,
    description: `Hire ${worker.name}, experienced ${tradeLabel.toLowerCase()} in ${worker.area} with ${worker.experience} year${worker.experience !== 1 ? 's' : ''} of experience. Call directly — no middlemen.`,
    openGraph: {
      title: `${worker.name} — ${tradeLabel} in ${worker.area}`,
      description: worker.bio ?? `${worker.experience} years of experience in ${worker.area}, ${cityFormatted}.`,
      type: 'profile',
    },
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default async function WorkerProfilePage({ params }: PageProps) {
  const { city, trade, slug } = await params
  const worker = await getWorker(slug)

  if (
    !worker ||
    worker.city !== city.toLowerCase() ||
    formatTradeUrl(worker.trade) !== trade.toLowerCase() ||
    !worker.is_active
  ) {
    notFound()
  }

  const avgRating =
    worker.reviews.length > 0
      ? worker.reviews.reduce((s, r) => s + r.rating, 0) / worker.reviews.length
      : null

  const tradeLabel = getTradeLabel(worker.trade)
  const cityFormatted = worker.city.charAt(0).toUpperCase() + worker.city.slice(1)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${worker.name} — ${tradeLabel}`,
    telephone: worker.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: worker.area,
      addressRegion: cityFormatted,
      postalCode: worker.pincode ?? undefined,
      addressCountry: 'IN',
    },
    ...(avgRating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: worker.reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(worker.profile_pic_url && { image: worker.profile_pic_url }),
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-warm-bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header
        variant="transparent"
        rightNode={
          <Link
            href="/"
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)', boxShadow: 'var(--shadow-button)' }}
          >
            Browse Workers
          </Link>
        }
      />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-1">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-charcoal-60)' }}>
          <Link href="/" className="hover:opacity-70">Home</Link>
          <span>›</span>
          <Link href={`/?city=${worker.city}`} className="hover:opacity-70 capitalize">{worker.city}</Link>
          <span>›</span>
          <Link href={`/?trade=${worker.trade}`} className="hover:opacity-70">{tradeLabel}</Link>
          <span>›</span>
          <span style={{ color: 'var(--color-charcoal)' }}>{worker.name}</span>
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Profile card */}
            <article className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-start gap-4">
                {worker.profile_pic_url ? (
                  <img src={worker.profile_pic_url} alt={worker.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
                ) : (
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
                    aria-hidden="true"
                  >
                    {getInitials(worker.name)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--color-charcoal)' }}>
                      {worker.name}
                    </h1>
                    {worker.is_verified && (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-teal-light)', color: 'var(--color-teal-dark)' }}
                      >
                        Verified
                      </span>
                    )}
                  </div>

                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full mt-2"
                    style={{ backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
                  >
                    {tradeLabel}
                  </span>

                  {avgRating !== null && (
                    <div className="flex items-center gap-2 mt-2">
                      <StarDisplay rating={Math.round(avgRating)} />
                      <span className="text-sm" style={{ color: 'var(--color-charcoal-60)' }}>
                        {avgRating.toFixed(1)} ({worker.reviews.length} review{worker.reviews.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {worker.bio && (
                <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                  {worker.bio}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 rounded-xl p-3" style={{ backgroundColor: 'var(--color-warm-bg)' }}>
                  <span className="text-lg" aria-hidden="true">
                    <img src="https://img.icons8.com/?size=100&id=6OOnASO9fxuG&format=png&color=000000" width={24} height={24} alt='location' />
                  </span>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--color-charcoal-60)' }}>Area</div>
                    <div className="text-sm font-medium mt-0.5" style={{ color: 'var(--color-charcoal)' }}>{`${worker.area}, ${cityFormatted}${worker.pincode ? ` — ${worker.pincode}` : ''}`}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-xl p-3" style={{ backgroundColor: 'var(--color-warm-bg)' }}>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--color-charcoal-60)' }}>Experience</div>
                    <div className="text-sm font-medium mt-0.5" style={{ color: 'var(--color-charcoal)' }}>{`${worker.experience} year${worker.experience > 1 ? 's' : ''}`}</div>
                  </div>
                </div>
                {/* ))} */}
              </div>
            </article>

            {/* Reviews */}
            <section className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-card)' }} aria-labelledby="reviews-heading">
              <h2 id="reviews-heading" className="font-bold text-base mb-4" style={{ color: 'var(--color-charcoal)' }}>
                Customer Reviews
                {worker.reviews.length > 0 && (
                  <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}>
                    {worker.reviews.length}
                  </span>
                )}
              </h2>

              <ReviewList reviews={worker.reviews} />

              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#f0ede9' }}>
                <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-charcoal)' }}>Leave a Review</h3>
                <ReviewForm workerId={worker.id} />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl p-5 lg:sticky lg:top-20" style={{ boxShadow: 'var(--shadow-card)' }}>
              <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--color-charcoal)' }}>
                Contact {worker.name.split(' ')[0]}
              </h2>
              <ContactButtons
                workerId={worker.id}
                phone={worker.phone}
                trade={worker.trade as Trade}
                workerName={worker.name}
              />
              <p className="text-xs text-center mt-3" style={{ color: 'var(--color-charcoal-60)' }}>
                Your call or message goes directly to the worker — no middlemen.
              </p>
            </div>

            {/* <div className="bg-white rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
              <h2 className="font-bold text-sm mb-3" style={{ color: 'var(--color-charcoal)' }}>Quick Info</h2>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2.5">
                  <span className="text-base" aria-hidden="true">
                    
                  </span>
                  <span style={{ color: 'var(--color-charcoal)' }}>{worker.area}, <span className="capitalize">{worker.city}</span></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-base" aria-hidden="true">🏆</span>
                  <span style={{ color: 'var(--color-charcoal)' }}>{worker.experience} years experience</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span style={{ color: 'var(--color-charcoal)' }}>{tradeLabel}</span>
                </li>
                {worker.is_verified && (
                  <li className="flex items-center gap-2.5">
                    <span className="text-base" aria-hidden="true">✅</span>
                    <span style={{ color: 'var(--color-teal-dark)' }}>Verified by Sevasaathi</span>
                  </li>
                )}
              </ul>
            </div> */}
          </aside>
        </div>
      </main>

      <Footer className="mt-6" />
    </div>
  )
}
