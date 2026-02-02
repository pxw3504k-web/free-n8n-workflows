import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

// Utility: map some known apps to emoji placeholders
const APP_ICON: Record<string, string> = {
  gmail: "📧",
  google: "📧",
  gmail_api: "📧",
  notion: "📝",
  slack: "💬",
  google_sheets: "📊",
  sheets: "📊",
  trello: "📋",
  airtable: "🗂️",
  default: "🔗",
};

function emojiFor(name: string) {
  if (!name) return APP_ICON.default;
  const key = name.trim().toLowerCase();
  return APP_ICON[key] || APP_ICON.default;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Free N8N Workflow";
    const nodesParam = searchParams.get("nodes") || "";
    const nodes = nodesParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8); // limit icons

    const width = 1200;
    const height = 630;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background:
              "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
            padding: "48px",
            color: "white",
            fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            boxSizing: "border-box",
          }}
        >
          {/* Top bar with badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                background: "#10b981",
                color: "white",
                padding: "8px 14px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Free Automation Workflow
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              flex: 1,
              padding: "40px 80px",
            }}
          >
            <h1
              style={{
                fontSize: 56,
                lineHeight: 1.05,
                fontWeight: 800,
                margin: 0,
                color: "white",
                wordBreak: "break-word",
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom row: nodes + footer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
                fontSize: 28,
              }}
            >
              {nodes.length > 0 ? (
                nodes.map((n) => (
                  <div
                    key={n}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 12,
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{emojiFor(n)}</span>
                    <span style={{ fontSize: 22, color: "white" }}>{n}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: "rgba(255,255,255,0.7)" }}>
                  🔗 Free N8N Workflow
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "rgba(255,255,255,0.6)",
                fontSize: 16,
                paddingTop: 8,
                borderTop: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div>Free N8N</div>
              <div>n8nworkflows.world</div>
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
        // fonts: pass Inter binary here if you want to load custom font.
      }
    );
  } catch (e) {
    console.error("OG generation error", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}


