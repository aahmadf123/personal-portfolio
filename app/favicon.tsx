import { ImageResponse } from "next/og"

export function Favicon() {
  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
    </>
  )
}

// Generate a dynamic favicon for OG image
export async function generateImageMetadata() {
  return [
    {
      contentType: "image/png",
      size: { width: 32, height: 32 },
      id: "favicon-32",
    },
    {
      contentType: "image/png",
      size: { width: 16, height: 16 },
      id: "favicon-16",
    },
  ]
}

export default function Icon({ id }: { id: string }) {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "black",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "50%",
      }}
    >
      AF
    </div>,
    {
      width: id === "favicon-16" ? 16 : 32,
      height: id === "favicon-16" ? 16 : 32,
    },
  )
}
