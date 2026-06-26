import type { AssetType } from "@/lib/types";

const TINTS: Record<AssetType, { bg: string; color: string }> = {
  crypto: { bg: "#efe9ff", color: "#7a5cf0" },
  stock: { bg: "#e7f0ff", color: "#2d7ff0" },
  gold: { bg: "#fbf3dc", color: "#b8860b" },
  fx: { bg: "#eef0f3", color: "#5a6675" },
};

export const CLASS_COLOR: Record<AssetType | "cash", string> = {
  crypto: "#7a5cf0",
  stock: "#2d7ff0",
  gold: "#d9a823",
  fx: "#5a6675",
  cash: "#13b07a",
};

export const CLASS_LABEL: Record<AssetType, string> = {
  crypto: "Crypto",
  stock: "Stocks",
  gold: "Gold",
  fx: "FX",
};

export function AssetIcon({
  type,
  label,
  size = 36,
}: {
  type: AssetType;
  label: string;
  size?: number;
}) {
  const tint = TINTS[type];
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        background: tint.bg,
        color: tint.color,
        fontSize: size * 0.4,
      }}
    >
      {label.charAt(0).toUpperCase()}
    </div>
  );
}

export function ClassBadge({ type }: { type: AssetType }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
      style={{ background: "#f1f1ea", color: "#6a7079" }}
    >
      {CLASS_LABEL[type]}
    </span>
  );
}
