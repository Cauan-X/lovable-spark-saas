import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/spark-logo.png";

type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
  as?: "link" | "div";
  to?: string;
};

export function Logo({
  size = 28,
  withWordmark = true,
  className = "",
  wordmarkClassName = "text-[15px] font-semibold tracking-tight",
  as = "link",
  to = "/",
}: LogoProps) {
  const inner = (
    <>
      <span
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <span
          className="absolute inset-0 rounded-full bg-primary/40 blur-lg opacity-70"
          aria-hidden
        />
        <img
          src={logoSrc}
          alt="Spark"
          width={size}
          height={size}
          className="relative h-full w-full object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.45)]"
          draggable={false}
        />
      </span>
      {withWordmark && (
        <span className={wordmarkClassName}>Spark</span>
      )}
    </>
  );

  if (as === "div") {
    return <div className={`flex items-center gap-2.5 ${className}`}>{inner}</div>;
  }
  return (
    <Link to={to} className={`flex items-center gap-2.5 ${className}`}>
      {inner}
    </Link>
  );
}