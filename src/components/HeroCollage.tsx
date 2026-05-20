import { useMemo, type CSSProperties } from 'react'
import { getCollageOrder } from '@/lib/collage'

export function HeroCollage() {
  const images = useMemo(() => getCollageOrder(), [])
  const cycleSeconds = images.length * 2.4
  const slideDuration = cycleSeconds / images.length

  return (
    <div className="hero-collage absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-cinema">
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="hero-cinema-slide"
            data-index={i % 4}
            style={
              {
                '--delay': `${i * slideDuration}s`,
                '--cycle': `${cycleSeconds}s`,
              } as CSSProperties
            }
          >
            <img src={src} alt="" loading={i < 4 ? 'eager' : 'lazy'} decoding="async" />
          </div>
        ))}
      </div>

      <div className="hero-grain" />
      <div className="hero-vignette" />
    </div>
  )
}
