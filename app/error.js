"use client" // this one is a client-only boundary
import { useEffect } from "react"

export default function GlobalError({ error, reset }) {
  useEffect(() => console.error(error), [error])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Oops—something went wrong</h1>
      <pre style={{ whiteSpace: "pre-wrap", color: "#e00" }}>{error.message}</pre>
      <button
        onClick={() => reset()}
        style={{
          marginTop: "1.5rem",
          padding: "0.75rem 1.5rem",
          background: "#e00",
          color: "white",
          borderRadius: "0.375rem",
          border: "none",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  )
}
