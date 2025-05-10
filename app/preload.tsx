export default function Preload() {
  return (
    <>
      {/* Preload critical fonts */}
      <link rel="preload" href="/fonts/Inter-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/Inter-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />

      {/* Preload critical images */}
      <link rel="preload" href="/professional-headshot.png" as="image" type="image/png" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    </>
  )
}
