import { Caption } from "@/components/caption";
import { Frame } from "@/components/frame";
import { inlineLink } from "@/lib/styles";
import type { MDXComponents } from "mdx/types";

/* eslint-disable jsx-a11y/heading-has-content, jsx-a11y/anchor-has-content */
export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="font-serif text-heading font-extralight text-ink" {...props} />,
  h2: (props) => <h2 className="mt-10 mb-4 font-serif text-h2 font-light text-ink" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 font-sans text-h3 font-light text-ink" {...props} />,
  p: (props) => <p className="mt-4 text-body text-dim" {...props} />,
  a: (props) => <a className={inlineLink} {...props} />,
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-dim marker:text-muted" {...props} />
  ),
  ol: (props) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 text-body text-dim marker:text-muted"
      {...props}
    />
  ),
  li: (props) => <li className="pl-0.5" {...props} />,
  code: (props) => (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-body-sm text-dim" {...props} />
  ),
  pre: (props) => (
    <pre
      className="mt-5 overflow-x-auto rounded-md bg-surface p-4 font-mono text-body-sm text-dim"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-5 border-l-2 border-border pl-4 text-body text-muted italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img className="mt-5 rounded-md" {...props} />
  ),
  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="mt-5 rounded-md border border-accent/20 bg-accent/5 px-5 py-4 text-body text-dim">
      {children}
    </div>
  ),
  Frame,
  Caption,
};
