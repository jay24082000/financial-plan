export function ProfileBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div className="hidden shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-[#ebebe3] bg-white px-3.5 py-[7px] shadow-[0_1px_2px_rgba(20,25,30,0.04)] lg:flex">
        <span className="h-[7px] w-[7px] rounded-full bg-[#13b07a] shadow-[0_0_0_3px_rgba(19,176,122,0.18)]" />
        <span className="text-[12.5px] font-semibold text-[#3a4048]">
          On track
        </span>
        <span className="mer-num text-[12.5px] font-semibold text-[#0e9466]">
          92%
        </span>
      </div>
      <div className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#2a3340] to-[#3c4a5c] text-[13px] font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
        AC
      </div>
    </div>
  );
}
