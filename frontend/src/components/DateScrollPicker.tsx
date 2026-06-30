// src/components/DateScrollPicker.tsx
import {  useRef, useState } from "react";

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const DAYS   = Array.from({length:31},(_,i)=>String(i+1).padStart(2,'0'));
const YEARS  = Array.from({length:71},(_,i)=>String(1940+i));
const ITEM_H = 36;
const PAD    = 2; // visible items above/below center

function Drum({ items, selectedIdx, onChange }: {
  items: string[]; selectedIdx: number; onChange: (i: number) => void;
}) {
  const startY   = useRef(0);
  const startIdx = useRef(selectedIdx);

  function clamp(i: number) { return Math.max(0, Math.min(items.length - 1, i)); }

  const onMouseDown = (e: React.MouseEvent) => {
    startY.current   = e.clientY;
    startIdx.current = selectedIdx;
    const onMove = (ev: MouseEvent) => {
      const delta = Math.round((startY.current - ev.clientY) / ITEM_H);
      onChange(clamp(startIdx.current + delta));
    };
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current   = e.touches[0].clientY;
    startIdx.current = selectedIdx;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const delta = Math.round((startY.current - e.touches[0].clientY) / ITEM_H);
    onChange(clamp(startIdx.current + delta));
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    onChange(clamp(selectedIdx + (e.deltaY > 0 ? 1 : -1)));
  };

  return (
    <div
      className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ height: ITEM_H * (PAD * 2 + 1), width: 90 }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onWheel={onWheel}
    >
      {/* fade top */}
      <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: ITEM_H * PAD, background: "linear-gradient(to bottom, white 0%, transparent 100%)" }} />
      {/* fade bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: ITEM_H * PAD, background: "linear-gradient(to top, white 0%, transparent 100%)" }} />
      {/* selector line */}
      <div className="absolute inset-x-0 border-t border-b border-[#e5e7eb] z-20 pointer-events-none"
        style={{ top: ITEM_H * PAD, height: ITEM_H }} />
      {/* items */}
      <div
        className="flex flex-col transition-transform duration-150"
        style={{ transform: `translateY(${(-selectedIdx + PAD) * ITEM_H}px)` }}
      >
        {items.map((item, i) => (
          <div key={item}
            className="flex items-center justify-center transition-all duration-150"
            style={{
              height: ITEM_H,
              fontSize:   i === selectedIdx ? 20 : 14,
              fontWeight: i === selectedIdx ? 600 : 400,
              color:      i === selectedIdx ? "#111827" : "#9ca3af",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  value: string;           // YYYY-MM-DD
  onChange: (v: string) => void;
  onClose: () => void;
}

export default function DateScrollPicker({ value, onChange, onClose }: Props) {
  const parsed = value ? value.split("-") : [];
  const [monthIdx, setMonthIdx] = useState(parsed[1] ? Number(parsed[1]) - 1 : new Date().getMonth());
  const [dayIdx,   setDayIdx]   = useState(parsed[2] ? Number(parsed[2]) - 1 : 0);
  const [yearIdx,  setYearIdx]  = useState(parsed[0] ? YEARS.indexOf(parsed[0]) : 50);

  function confirm() {
    const y = YEARS[yearIdx];
    const m = String(monthIdx + 1).padStart(2, "0");
    const d = DAYS[dayIdx];
    onChange(`${y}-${m}-${d}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-t-[20px] sm:rounded-[16px] w-full sm:max-w-[360px] pb-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <span className="font-semibold text-[#111827] text-[16px]">Date of Birth</span>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#111827] text-[20px] leading-none">✕</button>
        </div>
        {/* Drums */}
        <div className="flex items-center justify-center gap-2 px-4 py-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] text-[#9ca3af] font-medium uppercase tracking-wide">Month</span>
            <Drum items={MONTHS} selectedIdx={monthIdx} onChange={setMonthIdx} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] text-[#9ca3af] font-medium uppercase tracking-wide">Day</span>
            <Drum items={DAYS} selectedIdx={dayIdx} onChange={setDayIdx} />
          </div>
          <div className="flex flex-col items-center gap-1" style={{ width: 90 }}>
            <span className="text-[11px] text-[#9ca3af] font-medium uppercase tracking-wide">Year</span>
            <Drum items={YEARS} selectedIdx={yearIdx} onChange={setYearIdx} />
          </div>
        </div>
        {/* Confirm */}
        <div className="px-5 pt-3">
          <button onClick={confirm}
            className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] w-full h-12 rounded-[8px] font-medium text-white text-[14px] hover:opacity-90 transition">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}