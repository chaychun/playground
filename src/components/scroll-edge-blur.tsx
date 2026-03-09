import { cn } from "@/lib/cn";

const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

type ScrollEdgeBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  blurIntensity?: number;
  className?: string;
} & React.ComponentProps<"div">;

export function ScrollEdgeBlur({
  direction = "bottom",
  blurLayers = 8,
  blurIntensity = 0.25,
  className,
  ...props
}: ScrollEdgeBlurProps) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (layers + 1);

  return (
    <div className={cn("relative", className)} aria-hidden="true" {...props}>
      {/* Color fade — paper drops off quickly toward transparent */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(${(GRADIENT_ANGLES[direction] + 180) % 360}deg, var(--paper) 0%, color-mix(in oklch, var(--paper) 40%, transparent) 30%, transparent 70%)`,
        }}
      />
      {Array.from({ length: layers }, (_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255,255,255,${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`,
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(", ")})`;

        return (
          <div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${index * blurIntensity}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
