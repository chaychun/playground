import { StaggerEntrance } from "@/components/stagger-entrance";
import { getAllItems, getPreviewBySlug } from "@/lib/content";
import { inlineLink } from "@/lib/styles";
import { DEFAULT_CATEGORY } from "@/lib/types";
import type { PreviewConfig } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

function Intro() {
  return (
    <div className="pt-8 pb-30">
      <h1 className="font-serif text-heading font-extralight text-ink">
        I&apos;m Chayut, a designer and builder exploring{" "}
        <em className="text-accent italic">interface craft</em>.
      </h1>
      <p className="mt-5 text-body text-dim">
        This site is a collection of my experiments, studies, and writings on software design. Feel
        free to explore! You can also read{" "}
        <Link href="/about" className={inlineLink}>
          about me
        </Link>{" "}
        and see what I&apos;m{" "}
        <Link href="/now" className={inlineLink}>
          currently up to
        </Link>
        .
      </p>
    </div>
  );
}

function ItemPreview({ preview }: { preview?: PreviewConfig }) {
  if (!preview?.src) return null;

  const src = Array.isArray(preview.src) ? preview.src[0] : preview.src;
  const isVideo = typeof src === "string" && (src.endsWith(".mp4") || src.endsWith(".webm"));

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-lg"
      style={{ background: preview.bg ?? "var(--color-surface)" }}
    >
      {isVideo ? (
        <video
          src={src as string}
          autoPlay
          loop
          muted
          playsInline
          className={`h-full w-full ${preview.fit === "contain" ? "object-contain" : "object-cover"}`}
          style={preview.position ? { objectPosition: preview.position } : undefined}
        />
      ) : (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 744px) 100vw, 680px"
          className={preview.fit === "contain" ? "object-contain" : "object-cover"}
          style={{
            ...(preview.position ? { objectPosition: preview.position } : undefined),
            ...(preview.padding ? { padding: `${preview.padding}%` } : undefined),
          }}
        />
      )}
    </div>
  );
}

export default async function Home() {
  const [items, previewMap] = await Promise.all([getAllItems(), getPreviewBySlug()]);

  return (
    <>
      <Intro />
      <StaggerEntrance className="space-y-16 pb-16">
        {items.map((item) => (
          <Link key={item.slug} href={`/${item.slug}`} className="block">
            <ItemPreview preview={previewMap[item.slug]} />
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <span className="font-serif text-item-title font-light text-ink">{item.title}</span>
              <span className="shrink-0 font-mono text-meta tracking-[0.04em] text-muted uppercase">
                {item.category || DEFAULT_CATEGORY}
              </span>
            </div>
            {item.description && <p className="mt-1.5 text-body-sm text-dim">{item.description}</p>}
          </Link>
        ))}
      </StaggerEntrance>
    </>
  );
}
