export function StaxLogo({
  size = 32,
  shadow = true,
}: {
  size?: number;
  shadow?: boolean;
}) {
  const barW = Math.round(size * 0.44);
  const barH = Math.max(2, Math.round(size * 0.082));
  const gap = Math.max(2, Math.round(size * 0.08));
  const radius = Math.round(size * 0.28);
  return (
    <div
      className="flex flex-col items-center justify-center bg-[#13b07a]"
      style={{
        width: size,
        height: size,
        gap,
        borderRadius: radius,
        boxShadow: shadow ? "0 2px 8px rgba(19,176,122,0.3)" : undefined,
      }}
    >
      <span
        style={{
          width: barW,
          height: barH,
          borderRadius: 2,
          background: "#fff",
        }}
      />
      <span
        style={{
          width: barW,
          height: barH,
          borderRadius: 2,
          background: "rgba(255,255,255,0.75)",
        }}
      />
      <span
        style={{
          width: barW,
          height: barH,
          borderRadius: 2,
          background: "rgba(255,255,255,0.45)",
        }}
      />
    </div>
  );
}
