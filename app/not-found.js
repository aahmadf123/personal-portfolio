// purely a server component, no hooks at all
export default function NotFound() {
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
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>404 — Page Not Found</h1>
      <p style={{ marginBottom: "1.5rem" }}>Sorry, we couldn't find that page.</p>
      <a
        href="/"
        style={{
          padding: "0.75rem 1.5rem",
          background: "#0070f3",
          color: "white",
          borderRadius: "0.375rem",
          textDecoration: "none",
        }}
      >
        Go Home
      </a>
    </div>
  )
}
