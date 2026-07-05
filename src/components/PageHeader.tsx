export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-5">
      <div>
        <h1 className="text-[27px] font-extrabold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-[14px] text-[#8a8f98]">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-300 px-5 pb-14 pt-1 md:px-10">
      {children}
    </div>
  );
}
