import { readFileSync } from "node:fs";
import { join } from "node:path";

import { StaggerEntrance } from "@/components/stagger-entrance";
import { descriptionMdxComponents } from "@/lib/mdx-components";
import { compileMDX } from "next-mdx-remote/rsc";

type NowEntry = {
  title: string;
  body: string;
};

type NowMonth = {
  heading: string;
  entries: NowEntry[];
};

function parseNowContent(): NowMonth[] {
  const source = readFileSync(join(process.cwd(), "src/data/now.mdx"), "utf-8");
  const months: NowMonth[] = [];

  const h2Sections = source.split(/^## /m).filter(Boolean);

  for (const section of h2Sections) {
    const [headingLine, ...rest] = section.split("\n");
    const body = rest.join("\n");
    const h3Sections = body.split(/^### /m);
    const entries: NowEntry[] = [];

    for (let i = 1; i < h3Sections.length; i++) {
      const [titleLine, ...entryRest] = h3Sections[i].split("\n");
      entries.push({
        title: titleLine.trim(),
        body: entryRest.join("\n").trim(),
      });
    }

    months.push({ heading: headingLine.trim(), entries });
  }

  return months;
}

async function EntryBody({ markdown }: { markdown: string }) {
  const { content } = await compileMDX({ source: markdown, components: descriptionMdxComponents });
  return <div className="mt-2 text-body text-dim">{content}</div>;
}

function TimelineContent({ data }: { data: NowMonth[] }) {
  return (
    <div className="relative mt-10">
      {data.map((month, monthIndex) => (
        <div
          key={month.heading}
          className="entrance relative pb-10 last:pb-0"
          style={{ animationDelay: `${200 + monthIndex * 80}ms` }}
        >
          <div className="absolute top-0 left-[7px] h-[3px] w-px bg-border" />
          <div className="absolute top-[7px] left-0 z-10 size-[15px] rounded-full border-2 border-accent/40 bg-accent/20" />
          <div className="absolute top-[26px] bottom-0 left-[7px] w-px bg-border" />

          <div className="pb-5 pl-[31px]">
            <span className="font-mono text-meta tracking-[0.08em] text-muted uppercase">
              {month.heading}
            </span>
          </div>

          <div className="ml-[31px] space-y-5">
            {month.entries.map((entry) => (
              <div key={entry.title}>
                <h3 className="font-serif text-h2 font-light text-ink">{entry.title}</h3>
                <EntryBody markdown={entry.body} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NowPage() {
  const data = parseNowContent();

  return (
    <div className="pt-8 pb-16">
      <StaggerEntrance>
        <h1 className="font-serif text-heading font-extralight text-ink">
          What I&apos;m doing, thinking about, and working on.
        </h1>
        <p className="mt-3 text-meta text-muted">
          This page is inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent/30 underline-offset-2 transition-colors hover:text-ink hover:decoration-accent"
          >
            the /now movement
          </a>
          .
        </p>
      </StaggerEntrance>
      <TimelineContent data={data} />
    </div>
  );
}
