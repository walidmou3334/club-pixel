/** Official owner-supplied artwork; keep the existing Figma layout footprint. */
export function PixelLogo({ size = 40, hero = false }: { size?: number; hero?: boolean }) {
  if (hero) return <span className="pixel-hero-logo"><img src="/pixel-logo.png" alt="PIXEL" width="501" height="501" /></span>;
  return <img src="/pixel-logo.png" alt="PIXEL" width={size} height={size} style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }} />;
}
