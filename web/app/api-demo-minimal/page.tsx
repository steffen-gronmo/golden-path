"use client";

import { faroInstance } from "@/instrumentation-client";
import type { Sak } from "@/lib/api";
import { getApiUrl } from "@/lib/client-utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function ApiDemoPage() {
  const {
    data: saker = [],
    isLoading,
    error,
  } = useQuery<Sak[]>({
    queryKey: ["saker"],
    queryFn: async () => {
      const response = await fetch(`${getApiUrl()}/saker`);
      const body = await response.json();
      faroInstance?.api.pushLog(["Received response from fetch /saker"], {
        context: {
          payload: body,
        },
      });
      return body;
    },
  });

  const getStatusColor = (status: Sak["status"]) => {
    switch (status) {
      case "Created":
        return "#6b7280";
      case "InProgress":
        return "#3b82f6";
      case "Done":
        return "#10b981";
      case "Archived":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  return (
    <div>
      <main>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <Image src="/next.svg" alt="Next.js logo" width={120} height={25} priority />
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Saker Management</h1>
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            }}
          >
            Error: {error.message}
          </div>
        )}

        {/* Saker List */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>All Saker</h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
                color: "#6b7280",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  border: "3px solid #f3f3f3",
                  borderTop: "3px solid #3498db",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: "0.5rem",
                }}
              />
              Loading saker...
            </div>
          )}

          {/* Empty State */}
          {!isLoading && saker.length === 0 && (
            <p style={{ color: "#6b7280", fontStyle: "italic" }}>
              No saker found. Create one above to get started.
            </p>
          )}

          {/* Saker List */}
          {!isLoading && saker.length > 0 && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {saker.map((sak) => (
                <div
                  key={sak.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    backgroundColor: "#fafafa",
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem" }}>
                        Org Nr: {sak.organisajonsnummer}
                      </h3>
                      <p
                        style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#6b7280" }}
                      >
                        ID: {sak.id}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            color: "white",
                            backgroundColor: getStatusColor(sak.status),
                          }}
                        >
                          {sak.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", textAlign: "right" }}>
                      <div>Created: {new Date(sak.created).toLocaleString()}</div>
                      <div>Updated: {new Date(sak.lastUpdated).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* API Info */}
        <section
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "1rem" }}>Backend API Info</h3>
          <p style={{ margin: "0.5rem 0", fontSize: "0.875rem", color: "#6b7280" }}>
            Backend URL: <code>{getApiUrl()}</code>
          </p>
          <p style={{ margin: "0.5rem 0", fontSize: "0.875rem", color: "#6b7280" }}>
            API Documentation:{" "}
            <a href={`${getApiUrl()}/scalar/v1`} target="_blank" rel="noopener noreferrer">
              View API Docs
            </a>
          </p>
        </section>

        {/* Add CSS animation for loading spinner */}
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    </div>
  );
}
