const neutrals = [
  { token: "paper", light: "#F3F3EF", dark: "#141312", role: "Page background" },
  { token: "surface", light: "#E9E9E5", dark: "#1E1D1B", role: "Cards, inputs, raised elements" },
  { token: "border", light: "#DCDCD8", dark: "#2C2B28", role: "Dividers, borders" },
  { token: "mid", light: "#C5C5C1", dark: "#3D3C39", role: "Placeholders, disabled states" },
  { token: "muted", light: "#9C9C98", dark: "#72716D", role: "Secondary text, metadata" },
  { token: "link", light: "#696966", dark: "#949390", role: "Tertiary interactive text" },
  { token: "dim", light: "#4A4A47", dark: "#A8A7A2", role: "Body text, descriptions" },
  { token: "ink", light: "#111110", dark: "#E8E7E3", role: "Headings, primary text" },
  { token: "ink-inv", light: "#F3F3EF", dark: "#141312", role: "Text on inverted surfaces" },
] as const;

const typeScale = [
  {
    token: "3xl",
    size: "32px",
    lineHeight: "1.1",
    tracking: "-0.02em",
    weight: "Regular (400)",
    role: "Hero display — landing pages, empty states",
  },
  {
    token: "2xl",
    size: "28px",
    lineHeight: "1.1",
    tracking: "-0.02em",
    weight: "Regular (400)",
    role: "Page titles",
  },
  {
    token: "xl",
    size: "24px",
    lineHeight: "1.2",
    tracking: "-0.01em",
    weight: "Medium (500)",
    role: "Section headings",
  },
  {
    token: "lg",
    size: "18px",
    lineHeight: "1.3",
    tracking: "-0.01em",
    weight: "Regular (400)",
    role: "Sub-headings, card titles",
  },
  {
    token: "sm",
    size: "14px",
    lineHeight: "1.6",
    tracking: "0",
    weight: "Regular (400)",
    role: "Body text — default reading size",
  },
  {
    token: "xs",
    size: "12px",
    lineHeight: "1.4",
    tracking: "0.04em",
    weight: "Regular (400)",
    role: "Labels, captions, timestamps",
  },
  {
    token: "2xs",
    size: "10px",
    lineHeight: "1.4",
    tracking: "0.08em",
    weight: "Regular (400)",
    role: "Mono specs, technical annotations",
  },
] as const;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 border-b border-border pb-3 text-xl font-medium tracking-[-0.01em] text-ink">
      {children}
    </h2>
  );
}

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">{children}</div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-5 py-10 md:px-6 md:py-16">
        {/* Header */}
        <header className="mb-10 md:mb-16">
          <div className="mb-3 font-mono text-2xs tracking-[0.08em] text-muted uppercase">
            Design System
          </div>
          <h1 className="mb-4 text-3xl leading-[1.1] font-normal tracking-[-0.02em] text-ink">
            Foundations
          </h1>
          <p className="max-w-[540px] text-sm leading-[1.6] text-dim">
            Typography and color tokens extracted from syne-refined. Two fonts, one neutral scale,
            light and dark.
          </p>
        </header>

        {/* ─── Typography ─── */}
        <section className="mb-20">
          <SectionHeading>Typography</SectionHeading>

          <p className="mb-10 text-sm leading-[1.6] text-dim">
            Two families. Manrope handles everything functional — body, headings, buttons, labels.
            IBM Plex Mono covers code, specs, and technical metadata. They never compete because
            they never overlap.
          </p>

          {/* Manrope */}
          <div className="mb-12">
            <MonoLabel>Sans — Body &amp; UI</MonoLabel>
            <div className="mb-4 text-2xl font-normal tracking-[-0.02em] text-ink">Manrope</div>
            <p className="mb-6 text-sm leading-[1.6] text-dim">
              The default for everything. Body text, buttons, labels, navigation, headings.
              Optimized for readability at 14px. Default weight is 400; use 500 for emphasis, 600
              for small labels and buttons, 700 rarely.
            </p>

            <MonoLabel>Weights</MonoLabel>
            <div className="mb-6 flex flex-wrap gap-6 md:gap-10">
              {(["font-normal", "font-medium", "font-semibold", "font-bold"] as const).map(
                (w, i) => (
                  <div key={w}>
                    <div className={`text-xl text-ink ${w} mb-1`}>Ag</div>
                    <div className="font-mono text-2xs text-muted">
                      {[400, 500, 600, 700][i]} {["Regular", "Medium", "Semibold", "Bold"][i]}
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="text-sm leading-[1.6] text-dim">
              The quick brown fox jumps over the lazy dog. Nodes in the knowledge graph represent
              discrete concepts, people, places, and ideas.
            </div>
          </div>

          {/* IBM Plex Mono */}
          <div className="mb-12">
            <MonoLabel>Monospace — Code &amp; Specs</MonoLabel>
            <div className="mb-4 font-mono text-2xl font-light text-ink">IBM Plex Mono</div>
            <p className="mb-6 text-sm leading-[1.6] text-dim">
              Technical contexts only. Metadata labels (uppercase, 10px, 0.08em tracking), color
              values, code blocks. Use 300 for subtle annotations, 400 for code, 500 for emphasis.
            </p>

            <MonoLabel>Weights</MonoLabel>
            <div className="mb-6 flex flex-wrap gap-6 md:gap-10">
              {(["font-light", "font-normal", "font-medium"] as const).map((w, i) => (
                <div key={w}>
                  <div className={`font-mono text-xl text-ink ${w} mb-1`}>Ag</div>
                  <div className="font-mono text-2xs text-muted">
                    {[300, 400, 500][i]} {["Light", "Regular", "Medium"][i]}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-baseline gap-5">
                <span className="w-20 shrink-0 font-mono text-2xs text-muted">Labels</span>
                <span className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">
                  Color System
                </span>
              </div>
              <div className="flex items-baseline gap-5">
                <span className="w-20 shrink-0 font-mono text-2xs text-muted">Specs</span>
                <span className="font-mono text-2xs text-muted">
                  28px / Regular / -0.02em / 1.1
                </span>
              </div>
              <div className="flex items-baseline gap-5">
                <span className="w-20 shrink-0 font-mono text-2xs text-muted">Code</span>
                <span className="font-mono text-sm font-normal text-dim">
                  const nodes = graph.query(filter)
                </span>
              </div>
            </div>
          </div>

          {/* Type Scale */}
          <div className="mb-12">
            <MonoLabel>Type Scale</MonoLabel>
            <p className="mb-8 text-sm leading-[1.6] text-dim">
              Seven steps from 10px to 32px. Tight at the top (1.1 line-height for display) and
              relaxed at the bottom (1.6 for body).
            </p>

            <div className="flex flex-col gap-8">
              {typeScale.map((t) => (
                <div key={t.token} className="flex items-baseline gap-5">
                  <span className="w-12 shrink-0 font-mono text-2xs text-muted">{t.token}</span>
                  <div className="flex-1">
                    <span
                      className={`text-ink ${t.token === "3xl" || t.token === "2xl" ? `text-${t.token} font-normal tracking-[-0.02em]` : ""} ${t.token === "xl" ? "text-xl font-medium tracking-[-0.01em]" : ""} ${t.token === "lg" ? "text-lg font-normal tracking-[-0.01em]" : ""} ${t.token === "sm" ? "text-sm font-normal text-dim" : ""} ${t.token === "xs" ? "text-xs font-normal tracking-[0.04em] text-muted" : ""} ${t.token === "2xs" ? "font-mono text-2xs tracking-[0.08em] text-muted uppercase" : ""}`}
                    >
                      {t.token === "sm"
                        ? "Body text. This is where users spend most of their time reading."
                        : t.token === "xs"
                          ? "3 connections · Feb 17, 2026 · 4:08 PM"
                          : t.token === "2xs"
                            ? "Color System"
                            : t.role.split("—")[0].trim()}
                    </span>
                    <div className="mt-1 font-mono text-2xs text-muted">
                      {t.token === "2xs" ? "IBM Plex Mono" : "Manrope"} · {t.size} / {t.weight} /{" "}
                      {t.tracking !== "0" ? `${t.tracking} / ` : ""}
                      {t.lineHeight}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Color ─── */}
        <section className="mb-20">
          <SectionHeading>Color</SectionHeading>

          <p className="mb-4 text-sm leading-[1.6] text-dim">
            Nine warm-tinted neutrals from paper (lightest) to ink (darkest). Each stop has a
            distinct role. Dark mode inverts the luminance order while keeping the same semantic
            meaning.
          </p>

          {/* Swatch strip */}
          <div className="mb-10">
            <MonoLabel>Light</MonoLabel>
            <div className="mb-6 grid grid-cols-5 gap-1 md:grid-cols-9">
              {neutrals.map((n) => (
                <div key={n.token} className="flex flex-col items-center gap-2">
                  <div
                    className="h-12 w-full border border-border"
                    style={{ backgroundColor: n.light }}
                  />
                  <div className="font-mono text-2xs text-muted">{n.token}</div>
                  <div className="hidden font-mono text-2xs text-muted md:block">{n.light}</div>
                </div>
              ))}
            </div>

            <MonoLabel>Dark</MonoLabel>
            <div className="mb-6 grid grid-cols-5 gap-1 md:grid-cols-9">
              {neutrals.map((n) => (
                <div key={n.token} className="flex flex-col items-center gap-2">
                  <div
                    className="h-12 w-full border border-border"
                    style={{ backgroundColor: n.dark }}
                  />
                  <div className="font-mono text-2xs text-muted">{n.token}</div>
                  <div className="hidden font-mono text-2xs text-muted md:block">{n.dark}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Token reference */}
          <div>
            <MonoLabel>Token Reference</MonoLabel>
            <div className="flex flex-col gap-4">
              {neutrals.map((n) => (
                <div key={n.token} className="flex items-center gap-3 md:gap-4">
                  <div
                    className="h-8 w-8 shrink-0 border border-border"
                    style={{ backgroundColor: n.light }}
                  />
                  <div className="w-14 shrink-0 md:w-20">
                    <code className="font-mono text-2xs text-ink">{n.token}</code>
                  </div>
                  <div className="hidden w-20 shrink-0 font-mono text-2xs text-muted md:block">
                    {n.light}
                  </div>
                  <div className="hidden w-20 shrink-0 font-mono text-2xs text-muted md:block">
                    {n.dark}
                  </div>
                  <div className="text-sm text-dim">{n.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Usage Quick Reference ─── */}
        <section className="mb-20">
          <SectionHeading>Quick Reference</SectionHeading>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-[120px_1fr]">
            <div className="pt-0.5 font-mono text-2xs text-muted">Headings</div>
            <p className="text-sm leading-[1.6] text-dim">
              <code className="font-mono text-2xs text-ink">text-ink</code>. Use medium (500) or
              semibold (600) weight. Track tighter at larger sizes: -0.02em for 2xl+, -0.01em for
              xl–lg.
            </p>

            <div className="pt-0.5 font-mono text-2xs text-muted">Body text</div>
            <p className="text-sm leading-[1.6] text-dim">
              <code className="font-mono text-2xs text-ink">text-dim</code> at 14px, regular weight,
              1.6 line-height. Not ink — it is too heavy for sustained reading.
            </p>

            <div className="pt-0.5 font-mono text-2xs text-muted">Secondary text</div>
            <p className="text-sm leading-[1.6] text-dim">
              <code className="font-mono text-2xs text-ink">text-muted</code> for timestamps,
              metadata, breadcrumbs, placeholders.
            </p>

            <div className="pt-0.5 font-mono text-2xs text-muted">Borders</div>
            <p className="text-sm leading-[1.6] text-dim">
              Always 1px <code className="font-mono text-2xs text-ink">border-border</code>. Never
              use border color as a background fill.
            </p>

            <div className="pt-0.5 font-mono text-2xs text-muted">Dark mode</div>
            <p className="text-sm leading-[1.6] text-dim">
              Set <code className="font-mono text-2xs text-ink">data-theme=&quot;dark&quot;</code>{" "}
              on html. All semantic tokens remap automatically — no conditional logic needed.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
