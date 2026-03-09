import { inlineLink } from "@/lib/styles";
import type { MDXComponents } from "mdx/types";

/* eslint-disable jsx-a11y/heading-has-content, jsx-a11y/anchor-has-content */
export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="font-serif text-[24px] leading-[30px] font-extralight text-ink xl:text-[32px] xl:leading-[38px]"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-8 mb-3 font-serif text-[18px] leading-[24px] font-light text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-6 mb-2 font-serif text-[16px] leading-[22px] font-light text-ink"
      {...props}
    />
  ),
  p: (props) => <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-dim" {...props} />,
  a: (props) => <a className={inlineLink} {...props} />,
  ul: (props) => (
    <ul
      className="mt-3 max-w-lg list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-dim marker:text-muted"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-3 max-w-lg list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-dim marker:text-muted"
      {...props}
    />
  ),
  li: (props) => <li className="pl-0.5" {...props} />,
  code: (props) => (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[12px] text-dim" {...props} />
  ),
  pre: (props) => (
    <pre
      className="mt-4 overflow-x-auto rounded-md bg-surface p-4 font-mono text-[12px] leading-relaxed text-dim"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-4 border-l-2 border-border pl-4 text-[13px] leading-relaxed text-muted italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img className="mt-4 rounded-md" {...props} />
  ),
  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="mt-4 max-w-lg rounded-md border border-accent/20 bg-accent/5 px-4 py-3 text-[13px] leading-relaxed text-dim">
      {children}
    </div>
  ),
};
