import { StaggerEntrance } from "@/components/stagger-entrance";
import timelineData from "@/data/now-timeline.json";

type TimelineEntry = {
  title: string;
  body: string;
  tags?: string[];
};

type MonthEntry = {
  month: string;
  year: number;
  entries: TimelineEntry[];
};

function TimelineContent({ data }: { data: MonthEntry[] }) {
  return (
    <div className="relative mt-10">
      {data.map((month, monthIndex) => (
        <div
          key={`${month.month}-${month.year}`}
          className="entrance relative pb-10 last:pb-0"
          style={{ animationDelay: `${200 + monthIndex * 80}ms` }}
        >
          <div className="absolute top-0 left-[7px] h-[3px] w-px bg-border" />
          <div className="absolute top-[7px] left-0 z-10 size-[15px] rounded-full border-2 border-accent/40 bg-accent/20" />
          <div className="absolute top-[26px] bottom-0 left-[7px] w-px bg-border" />

          <div className="pb-5 pl-[31px]">
            <span className="font-mono text-[13px] tracking-[0.08em] text-muted uppercase">
              {month.month} {month.year}
            </span>
          </div>

          <div className="ml-[31px] space-y-5">
            {month.entries.map((entry) => (
              <div key={entry.title}>
                <div className="flex items-baseline gap-x-2 gap-y-1">
                  <h3 className="min-w-0 flex-1 font-serif text-[18px] leading-[1.4] font-light text-ink">
                    {entry.title}
                  </h3>
                  {entry.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-[13px] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[16px] leading-[1.6] text-dim">{entry.body}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NowPage() {
  const data = timelineData as MonthEntry[];

  return (
    <div className="pt-8 pb-16">
      <StaggerEntrance>
        <h1 className="font-serif text-[28px] leading-[1.2] font-extralight text-ink">
          What I&apos;m doing, thinking about, and working on.
        </h1>
        <p className="mt-3 text-[13px] text-muted">
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
