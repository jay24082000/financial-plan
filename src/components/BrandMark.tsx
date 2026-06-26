import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#13b07a] shadow-[0_2px_8px_rgba(19,176,122,0.3)]">
        <div className="h-3 w-3 -rotate-45 rounded-full border-[2.5px] border-white border-r-transparent" />
      </div>
      <span className="hidden text-lg font-extrabold tracking-tight lg:inline">
        Meridian
      </span>
    </Link>
  );
}
