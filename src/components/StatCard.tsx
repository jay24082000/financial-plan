import { Card, CardLabel } from "./Card";

export function StatCard({
  label,
  value,
  sub,
  valueClass = "",
  subClass = "",
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
  subClass?: string;
}) {
  return (
    <Card>
      <CardLabel>{label}</CardLabel>
      <div className={`mer-num mt-1.5 text-[25px] font-semibold ${valueClass}`}>
        {value}
      </div>
      {sub && (
        <div className={`mt-0.5 text-[13px] font-medium ${subClass}`}>
          {sub}
        </div>
      )}
    </Card>
  );
}
