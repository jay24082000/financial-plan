"use client";

// Labelled range slider with the value shown on the right (Meridian style).
export function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  displayValue: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[13.5px] font-medium text-[#3a4048]">
          {label}
        </span>
        <span className="mer-num text-[14px] font-semibold">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        className="mer-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
