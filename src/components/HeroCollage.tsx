import type { CSSProperties } from 'react'
import { COLLAGE_IMAGES } from '@/lib/collage'

const CYCLE_SECONDS = COLLAGE_IMAGES.length * 2.4

export function HeroCollage() {
  return (
    <div className="hero-collage absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-cinema">
        {COLLAGE_IMAGES.map((src, i) => (
          <div
            key={src}
            className="hero-cinema-slide"
            data-index={i % 4}
            style={
              {
                '--delay': `${i * (CYCLE_SECONDS / COLLAGE_IMAGES.length)}s`,
                '--cycle': `${CYCLE_SECONDS}s`,
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
