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

export default function NowPage() {
  const data = timelineData as MonthEntry[];

  return (
    <div className="max-w-xl px-5 py-6 lg:py-8 lg:pr-8 lg:pl-0">
      <h1 className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">Now</h1>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink lg:text-2xl">
        What I&apos;m doing, thinking about, and working on.
      </h2>
      <p className="mt-3 text-2xs text-muted">
        This page is inspired by{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline decoration-border underline-offset-2 transition-colors hover:text-ink"
        >
          the /now movement
        </a>
        .
      </p>

      <div className="relative mt-10">
        {data.map((month) => (
          <div key={`${month.month}-${month.year}`} className="relative pb-10 last:pb-0">
            {/* Vertical line segment above the circle */}
            <div className="absolute top-0 left-[7px] h-[3px] w-px bg-border" />
            {/* Circle */}
            <div className="absolute top-[7px] left-0 z-10 size-[15px] rounded-full border-2 border-ink bg-paper" />
            {/* Vertical line segment below the circle */}
            <div className="absolute top-[26px] bottom-0 left-[7px] w-px bg-border" />

            {/* Month label */}
            <div className="pb-5 pl-[31px]">
              <span className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">
                {month.month} {month.year}
              </span>
            </div>

            {/* Entries */}
            <div className="ml-[31px] space-y-5">
              {month.entries.map((entry) => (
                <div key={entry.title}>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className="text-sm font-medium text-ink">{entry.title}</h3>
                    {entry.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface px-2 py-0.5 font-mono text-2xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{entry.body}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
