"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const generateCode = async () => {
    if (!image) return;

    setLoading(true);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await res.json();
      setHtml(data.html || "");
    } catch (error) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(html);
    alert("Code copied!");
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "generated.html";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 40%, #1e1b4b 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "24px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: "bold" }}>⚡ Image2Code AI</h2>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border: "none",
              background: "#6366f1",
              color: "white",
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "30px 20px 10px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            display: "inline-block",
            background: "rgba(99,102,241,0.15)",
            color: "#c7d2fe",
            padding: "8px 14px",
            borderRadius: 999,
            fontSize: 14,
            marginBottom: 18,
          }}
        >
          🚀 Convert screenshots into code instantly
        </p>

        <h1
          style={{
            fontSize: 56,
            lineHeight: 1.1,
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          Turn Any UI Image Into <br /> HTML with AI
        </h1>

        <p
          style={{
            maxWidth: 700,
            margin: "0 auto",
            color: "#cbd5e1",
            fontSize: 18,
            lineHeight: 1.6,
          }}
        >
          Upload a screenshot, landing page, dashboard or mobile UI and get clean
          frontend code generated in seconds.
        </p>
      </section>

      {/* Main Tool */}
      <section
        style={{
          maxWidth: 1300,
          margin: "40px auto 0",
          padding: "0 20px 60px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 24,
          }}
        >
          {/* Left */}
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 24,
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 style={{ fontSize: 24, marginBottom: 20 }}>
              📤 Upload Your Image
            </h3>

            <label
              style={{
                display: "block",
                border: "2px dashed rgba(255,255,255,0.18)",
                borderRadius: 18,
                padding: 30,
                textAlign: "center",
                cursor: "pointer",
                color: "#cbd5e1",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ display: "none" }}
              />

              <div style={{ fontSize: 48, marginBottom: 10 }}>🖼️</div>
              <p style={{ fontSize: 18, marginBottom: 8 }}>
                Click to upload image
              </p>
              <p style={{ fontSize: 14, opacity: 0.7 }}>
                PNG, JPG, WEBP supported
              </p>
            </label>

            {image && (
              <img
                src={image}
                alt="preview"
                style={{
                  width: "100%",
                  marginTop: 18,
                  borderRadius: 16,
                  maxHeight: 320,
                  objectFit: "cover",
                }}
              />
            )}

            <button
              onClick={generateCode}
              disabled={!image || loading}
              style={{
                width: "100%",
                marginTop: 20,
                padding: "14px 18px",
                borderRadius: 14,
                border: "none",
                background: loading ? "#475569" : "#6366f1",
                color: "white",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? "Generating..." : "✨ Generate Code"}
            </button>
          </div>

          {/* Right */}
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 20,
              color: "#111827",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <h3 style={{ fontSize: 22 }}>🎨 Live Preview</h3>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={copyCode}
                  disabled={!html}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Copy
                </button>

                <button
                  onClick={downloadHtml}
                  disabled={!html}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "none",
                    background: "#111827",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              </div>
            </div>

            <iframe
              srcDoc={
                html ||
                "<html><body style='display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial'>Generated preview will appear here ✨</body></html>"
              }
              style={{
                width: "100%",
                height: 420,
                border: "1px solid #e5e7eb",
                borderRadius: 18,
                marginBottom: 16,
              }}
            />

            <textarea
              value={html}
              readOnly
              placeholder="Generated code will appear here..."
              style={{
                width: "100%",
                height: 180,
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                padding: 14,
                resize: "none",
                fontFamily: "monospace",
              }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          paddingBottom: 40,
          color: "#94a3b8",
        }}
      >
        Built with AI • Powered by DeepSeek
      </footer>
    </main>
  );
}