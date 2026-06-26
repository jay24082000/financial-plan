import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  if (dark) {
    return (
      <div
        className={`rounded-[18px] bg-[#10141a] p-5 text-white shadow-[0_1px_2px_rgba(20,25,30,0.03)] ${className}`}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={`rounded-[18px] border border-[#ecece4] bg-white p-5 shadow-[0_1px_2px_rgba(20,25,30,0.03)] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[13px] font-semibold text-[#8a8f98]">{children}</div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <div className="text-[14.5px] font-bold">{children}</div>;
}
