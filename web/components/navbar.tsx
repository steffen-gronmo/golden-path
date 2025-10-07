import { Heading } from "@arbeidstilsynet/design-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        height: 64,
        gap: 32,
      }}
      aria-label="Hovedmeny"
    >
      <Heading level={2} data-size="sm" style={{ margin: 0 }}>
        <Link href="/" style={{ textDecoration: "none" }} className="ds-link">
          Example webapp
        </Link>
      </Heading>
      <div style={{ display: "flex", gap: 16 }}>
        <Link href="/api-demo" className="ds-link">
          API Demo
        </Link>
        <Link href="/api-demo-minimal" className="ds-link">
          API Demo (minimal)
        </Link>
      </div>
    </nav>
  );
}
