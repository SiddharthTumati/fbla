/** Chapter photos for hero montage (collage-01 = chapter group photo) */
export const COLLAGE_IMAGES: string[] = Array.from({ length: 19 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return `/branding/collage/collage-${n}.png`
})

/** Panoramic chapter group — always first slide on first visit */
export const GROUP_COLLAGE_IMAGE = COLLAGE_IMAGES[0]

const COLLAGE_SEEN_KEY = 'fbla:collage-seen'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** First visit: group photo first, then shuffled rest. Return visits: fully shuffled. */
export function getCollageOrder(): string[] {
  const rest = COLLAGE_IMAGES.filter((src) => src !== GROUP_COLLAGE_IMAGE)

  try {
    if (!localStorage.getItem(COLLAGE_SEEN_KEY)) {
      localStorage.setItem(COLLAGE_SEEN_KEY, '1')
      return [GROUP_COLLAGE_IMAGE, ...shuffle(rest)]
    }
  } catch {
    return [GROUP_COLLAGE_IMAGE, ...shuffle(rest)]
  }

  return shuffle(COLLAGE_IMAGES)
}
