import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`logo${inverse ? " logo--inverse" : ""}`} href="/" aria-label="SafeTrip home">
      <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>safetrip</span>
    </Link>
  );
}
