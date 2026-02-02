import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Free Google Opal Template";
    const icon = searchParams.get("icon") || "⚡";

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
              Free Google Opal Template
            </div>
          </div>

          {/* Title with Icon */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              flex: 1,
              padding: "40px 80px",
              gap: 24,
            }}
          >
            {/* Icon */}
            <div style={{ fontSize: 80 }}>
              {icon}
            </div>
            
            {/* Title */}
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

          {/* Footer */}
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
      ),
      {
        width,
        height,
      }
    );
  } catch (e) {
    console.error("OG generation error", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}

