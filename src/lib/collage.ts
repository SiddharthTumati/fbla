/** Chapter photos for hero montage — slides 01–10 are featured FBLA photos, then 11–19 */
export const COLLAGE_IMAGES: string[] = Array.from({ length: 19 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return `/branding/collage/collage-${n}.png`
})
