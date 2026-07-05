import Link from "next/link";
import { StaxLogo } from "./StaxLogo";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <StaxLogo size={32} />
      <span className="hidden text-lg font-extrabold tracking-tight lg:inline">
        Stax
      </span>
    </Link>
  );
}
