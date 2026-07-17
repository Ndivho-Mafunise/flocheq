import { cn } from "@/lib/utils";

type LogoVariant = "light" | "dark" | "gold";

interface LogoProps {
  /** light = ink text on white, dark = white text on ink, gold = all-ink for the gold footer */
  variant?: LogoVariant;
  /** render only the dial mark, no wordmark */
  compact?: boolean;
  className?: string;
}

const palette: Record<
  LogoVariant,
  { text: string; sub: string; ring: string; notch: string; dot: string }
> = {
  light: {
    text: "text-ink",
    sub: "text-[#A6A49C]",
    ring: "#E0C084",
    notch: "#111918",
    dot: "#E0C084",
  },
  dark: {
    text: "text-[#F5F5F4]",
    sub: "text-white/50",
    ring: "#E0C084",
    notch: "#F5F5F4",
    dot: "#E0C084",
  },
  gold: {
    text: "text-ink",
    sub: "text-ink/60",
    ring: "#111918",
    notch: "#111918",
    dot: "#111918",
  },
};

/** Dial mark — a nod to the knob navigation: ring, pointer notch, center pin */
function Mark({ variant, size }: { variant: LogoVariant; size: number }) {
  const c = palette[variant];
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden>
      <circle cx="13" cy="13" r="12" stroke={c.ring} strokeWidth="1.5" />
      <line
        x1="13"
        y1="13"
        x2="19.4"
        y2="6.6"
        stroke={c.notch}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="13" cy="13" r="2" fill={c.dot} />
    </svg>
  );
}

export default function Logo({
  variant = "light",
  compact = false,
  className,
}: LogoProps) {
  const c = palette[variant];

  if (compact) {
    return (
      <span className={cn("inline-flex", className)}>
        <Mark variant={variant} size={26} />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark variant={variant} size={28} />
      <span className="flex flex-col">
        <span
          className={cn(
            "text-[16px] font-medium uppercase leading-none tracking-[0.32em]",
            c.text,
          )}
        >
          Flocheq
        </span>
        <span
          className={cn(
            "mt-1.5 text-[7px] uppercase leading-none tracking-[0.34em]",
            c.sub,
          )}
        >
          The financial OS
        </span>
      </span>
    </span>
  );
}
