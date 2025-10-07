"use client";

import { useCreateSak, useSakAction, useSaker } from "@/hooks/useSaker";
import type { Sak } from "@/lib/api";
import { getApiUrl } from "@/lib/client-utils";
import Image from "next/image";
import { useState } from "react";

export default function ApiDemoPage() {
  const [newOrgNr, setNewOrgNr] = useState("");

  // Queries and mutations
  const { data: saker = [], isLoading, error, refetch } = useSaker();
  const createSakMutation = useCreateSak();
  const sakActionMutation = useSakAction();

  // Create new sak
  const handleCreateSak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgNr.trim()) return;

    try {
      await createSakMutation.mutateAsync({ organisajonsnummer: newOrgNr });
      setNewOrgNr("");
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Create sak failed:", error);
    }
  };

  // Perform action on sak
  const handleSakAction = async (
    action: "start-sak" | "end-sak" | "archive-sak",
    sakId: string,
  ) => {
    try {
      await sakActionMutation.mutateAsync({ action, sakId });
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Sak action failed:", error);
    }
  };

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

  const isAnyMutationLoading = createSakMutation.isPending || sakActionMutation.isPending;

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
            <button
              onClick={() => refetch()}
              style={{
                marginLeft: "1rem",
                padding: "0.25rem 0.5rem",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
                fontSize: "0.75rem",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Create Sak Mutation Error */}
        {createSakMutation.error && (
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
            Create Error: {createSakMutation.error.message}
          </div>
        )}

        {/* Action Mutation Error */}
        {sakActionMutation.error && (
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
            Action Error: {sakActionMutation.error.message}
          </div>
        )}

        {/* Create New Sak Form */}
        <section
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.25rem" }}>
            Create New Sak
          </h2>
          <form
            onSubmit={handleCreateSak}
            style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <input
              type="text"
              value={newOrgNr}
              onChange={(e) => setNewOrgNr(e.target.value)}
              placeholder="Organization Number (e.g., 123456789)"
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                minWidth: "250px",
              }}
              disabled={createSakMutation.isPending}
              pattern="[0-9]{9}"
              title="Organization number must be 9 digits"
            />
            <button
              type="submit"
              disabled={createSakMutation.isPending || !newOrgNr.trim()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: createSakMutation.isPending || !newOrgNr.trim() ? "not-allowed" : "pointer",
                opacity: createSakMutation.isPending || !newOrgNr.trim() ? 0.5 : 1,
              }}
            >
              {createSakMutation.isPending ? "Creating..." : "Create Sak"}
            </button>
          </form>
        </section>

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
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
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
                    opacity: isAnyMutationLoading ? 0.7 : 1,
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

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {sak.status === "Created" && (
                      <button
                        onClick={() => handleSakAction("start-sak", sak.id)}
                        disabled={isAnyMutationLoading}
                        style={{
                          padding: "0.375rem 0.75rem",
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "0.25rem",
                          fontSize: "0.875rem",
                          cursor: isAnyMutationLoading ? "not-allowed" : "pointer",
                          opacity: isAnyMutationLoading ? 0.5 : 1,
                        }}
                      >
                        {sakActionMutation.isPending ? "Starting..." : "Start"}
                      </button>
                    )}
                    {sak.status === "InProgress" && (
                      <button
                        onClick={() => handleSakAction("end-sak", sak.id)}
                        disabled={isAnyMutationLoading}
                        style={{
                          padding: "0.375rem 0.75rem",
                          backgroundColor: "#f59e0b",
                          color: "white",
                          border: "none",
                          borderRadius: "0.25rem",
                          fontSize: "0.875rem",
                          cursor: isAnyMutationLoading ? "not-allowed" : "pointer",
                          opacity: isAnyMutationLoading ? 0.5 : 1,
                        }}
                      >
                        {sakActionMutation.isPending ? "Ending..." : "End"}
                      </button>
                    )}
                    {(sak.status === "Done" || sak.status === "InProgress") && (
                      <button
                        onClick={() => handleSakAction("archive-sak", sak.id)}
                        disabled={isAnyMutationLoading}
                        style={{
                          padding: "0.375rem 0.75rem",
                          backgroundColor: "#8b5cf6",
                          color: "white",
                          border: "none",
                          borderRadius: "0.25rem",
                          fontSize: "0.875rem",
                          cursor: isAnyMutationLoading ? "not-allowed" : "pointer",
                          opacity: isAnyMutationLoading ? 0.5 : 1,
                        }}
                      >
                        {sakActionMutation.isPending ? "Archiving..." : "Archive"}
                      </button>
                    )}
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
