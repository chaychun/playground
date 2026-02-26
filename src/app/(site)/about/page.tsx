export default function AboutPage() {
  return (
    <div className="max-w-xl pr-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Lorem ipsum dolor sit amet.
      </h1>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-dim">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </p>
      </div>

      {/* Photo placeholder */}
      <div className="mt-10 aspect-[4/3] w-full max-w-sm rounded-lg bg-surface" />
    </div>
  );
}
