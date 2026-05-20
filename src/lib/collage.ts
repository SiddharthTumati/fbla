/** Selected chapter photos for animated landing collage (19 images) */
export const COLLAGE_IMAGES: string[] = Array.from({ length: 19 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return `/branding/collage/collage-${n}.png`
})
