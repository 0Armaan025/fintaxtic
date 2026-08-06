"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Sparkles, TrendingDown, Landmark, PiggyBank, ChevronDown, Scale } from "lucide-react";

/* ----------------------------------------------------------------------
   FinTaxtic — AI Tax Optimizer (Black & White)
   Old vs New regime comparison, FY 2025-26 / AY 2026-27 slabs (India).
   Estimates only — excludes surcharge & marginal relief.
------------------------------------------------------------------------- */

const c = {
  bg: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F5F4",
  border: "#111111",
  borderSoft: "#E4E4E1",
  text: "#0A0A0A",
  textMuted: "#5B5B58",
  textFaint: "#9A9A96",
  ink: "#0A0A0A",
};

const fmt = (n) =>
  "₹" + Math.round(Math.max(0, n)).toLocaleString("en-IN");

function slabTax(income, slabs) {
  let tax = 0;
  let last = 0;
  for (const s of slabs) {
    const cap = s.upto === Infinity ? income : Math.min(income, s.upto);
    if (cap > last) tax += (cap - last) * s.rate;
    last = s.upto === Infinity ? income : s.upto;
    if (income <= s.upto) break;
  }
  return tax;
}

const NEW_SLABS = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 0.05 },
  { upto: 1200000, rate: 0.1 },
  { upto: 1600000, rate: 0.15 },
  { upto: 2000000, rate: 0.2 },
  { upto: 2400000, rate: 0.25 },
  { upto: Infinity, rate: 0.3 },
];

const OLD_SLABS = {
  below60: [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.2 },
    { upto: Infinity, rate: 0.3 },
  ],
  senior: [
    { upto: 300000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.2 },
    { upto: Infinity, rate: 0.3 },
  ],
  superSenior: [
    { upto: 500000, rate: 0 },
    { upto: 1000000, rate: 0.2 },
    { upto: Infinity, rate: 0.3 },
  ],
};

const NEW_STD_DEDUCTION = 75000;
const OLD_STD_DEDUCTION = 50000;

function computeNew(gross) {
  const taxable = Math.max(0, gross - NEW_STD_DEDUCTION);
  let tax = taxable <= 1200000 ? 0 : slabTax(taxable, NEW_SLABS);
  tax *= 1.04;
  return { taxable, tax };
}

function computeOld(gross, ageBand, ded) {
  const c80c = Math.min(ded.c80c, 150000);
  const c80d = Math.min(ded.c80d, 100000);
  const hli = Math.min(ded.homeLoan, 200000);
  const nps = Math.min(ded.nps, 50000);
  const totalDed =
    OLD_STD_DEDUCTION + c80c + c80d + hli + ded.hra + nps + ded.other;
  const taxable = Math.max(0, gross - totalDed);
  const slabs = OLD_SLABS[ageBand];
  let tax = taxable <= 500000 ? 0 : slabTax(taxable, slabs);
  tax *= 1.04;
  return { taxable, tax, totalDed, breakdown: { c80c, c80d, hli, nps } };
}

function reasonFor(gross, newR, oldR) {
  const winner = newR.tax <= oldR.tax ? "new" : "old";
  if (winner === "new") {
    if (newR.taxable <= 1200000) {
      return "Your taxable income falls at or below ₹12L, so the Section 87A rebate zeroes out your New Regime tax entirely — deductions can't beat that.";
    }
    return `Your claimed deductions total ${fmt(
      oldR.totalDed
    )}, which isn't enough to offset the Old Regime's steeper slabs. The New Regime's lower rates win out even without exemptions.`;
  }
  return `Your deductions total ${fmt(
    oldR.totalDed
  )} — enough to shrink your taxable income far below the New Regime's flat standard deduction. That extra shelter outweighs the New Regime's lower rates.`;
}

function useTypewriter(text, speed = 14) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

function NumberField({ label, value, onChange, hint }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-xs uppercase tracking-wider font-medium"
        style={{ color: c.textFaint, fontFamily: "Inter, sans-serif" }}
      >
        {label}
      </span>
      <div
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5"
        style={{ background: c.surfaceAlt, border: `1px solid ${c.borderSoft}` }}
      >
        <span style={{ color: c.textFaint }}>₹</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent outline-none text-sm"
          style={{ color: c.text, fontFamily: "IBM Plex Mono, monospace" }}
        />
      </div>
      {hint && (
        <span className="text-xs" style={{ color: c.textFaint }}>
          {hint}
        </span>
      )}
    </label>
  );
}

export default function TaxOptimizer() {
  const [gross, setGross] = useState(1250000);
  const [ageBand, setAgeBand] = useState("below60");
  const [showDeductions, setShowDeductions] = useState(true);
  const [ded, setDed] = useState({
    c80c: 90000,
    c80d: 20000,
    homeLoan: 0,
    hra: 60000,
    nps: 0,
    other: 0,
  });
  const [printKey, setPrintKey] = useState(0);

  const newR = useMemo(() => computeNew(gross), [gross]);
  const oldR = useMemo(() => computeOld(gross, ageBand, ded), [gross, ageBand, ded]);

  const winner = newR.tax <= oldR.tax ? "new" : "old";
  const savings = Math.abs(newR.tax - oldR.tax);
  const reason = useMemo(() => reasonFor(gross, newR, oldR), [gross, newR, oldR]);
  const typedReason = useTypewriter(reason);

  const debounceRef = useRef(null);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setPrintKey((k) => k + 1), 350);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [gross, ageBand, ded]);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: c.bg, fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        @keyframes printOut {
          0% { transform: translateY(-14px) scaleY(0.96); opacity: 0; }
          60% { transform: translateY(2px) scaleY(1.01); opacity: 1; }
          100% { transform: translateY(0) scaleY(1); opacity: 1; }
        }
        @keyframes riseIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .receipt-print { animation: printOut 0.5s cubic-bezier(.2,.8,.2,1) both; transform-origin: top center; }
        .rise { animation: riseIn 0.5s ease both; }
        .perf-top, .perf-bottom {
          height: 10px;
          background-image: radial-gradient(circle at 6px 6px, #FFFFFF 4px, transparent 4.5px);
          background-size: 14px 14px;
          background-repeat: repeat-x;
        }
        .perf-top { background-position: 0 -4px; }
        .perf-bottom { background-position: 0 6px; }
        .btn-primary { background: #0A0A0A; color: #FFFFFF; }
        .btn-primary:hover { background: #262626; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: c.text }}
            >
              <Scale size={16} color="#FFFFFF" strokeWidth={2.25} />
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: c.text, fontFamily: "Space Grotesk, sans-serif" }}
            >
              FinTaxtic
            </span>
          </div>
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{ border: `1px solid ${c.border}`, color: c.text }}
          >
            <Sparkles size={12} color={c.text} />
            AI Tax Optimizer
          </div>
        </div>

        {/* Hero */}
        <div className="mb-10 max-w-2xl">
          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-3 leading-[1.08]"
            style={{ color: c.text, fontFamily: "Space Grotesk, sans-serif" }}
          >
            Old regime or new?
            <br />
            <span style={{ color: c.textMuted }}>Let's settle it.</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>
            Enter your income and deductions once. We'll run both regimes,
            tell you which wins, and explain why in plain English —
            no jargon, no guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input column */}
          <div
            className="lg:col-span-2 rounded-2xl p-5"
            style={{ background: c.surface, border: `1px solid ${c.border}` }}
          >
            <NumberField
              label="Gross annual income"
              value={gross}
              onChange={setGross}
              hint="Before any exemptions or deductions"
            />

            <div className="mt-5">
              <span
                className="text-xs uppercase tracking-wider font-medium block mb-2"
                style={{ color: c.textFaint }}
              >
                Age band
              </span>
              <div className="flex gap-2">
                {[
                  ["below60", "< 60"],
                  ["senior", "60–80"],
                  ["superSenior", "80+"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setAgeBand(key)}
                    className="flex-1 text-xs py-2 rounded-lg font-medium transition-colors"
                    style={{
                      background: ageBand === key ? c.text : "#FFFFFF",
                      color: ageBand === key ? "#FFFFFF" : c.textMuted,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span className="text-xs mt-1.5 block" style={{ color: c.textFaint }}>
                Old Regime exemption limits shift by age. New Regime doesn't.
              </span>
            </div>

            <button
              onClick={() => setShowDeductions((s) => !s)}
              className="w-full flex items-center justify-between mt-6 mb-3 text-xs uppercase tracking-wider font-medium"
              style={{ color: c.textFaint }}
            >
              Old regime deductions
              <ChevronDown
                size={14}
                style={{
                  transform: showDeductions ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {showDeductions && (
              <div className="grid grid-cols-2 gap-3 rise">
                <NumberField label="80C (PF, ELSS, LIC)" value={ded.c80c} onChange={(v) => setDed({ ...ded, c80c: v })} />
                <NumberField label="80D (health cover)" value={ded.c80d} onChange={(v) => setDed({ ...ded, c80d: v })} />
                <NumberField label="Home loan interest" value={ded.homeLoan} onChange={(v) => setDed({ ...ded, homeLoan: v })} />
                <NumberField label="HRA exemption" value={ded.hra} onChange={(v) => setDed({ ...ded, hra: v })} />
                <NumberField label="NPS 80CCD(1B)" value={ded.nps} onChange={(v) => setDed({ ...ded, nps: v })} />
                <NumberField label="Other (80E, 80G…)" value={ded.other} onChange={(v) => setDed({ ...ded, other: v })} />
              </div>
            )}
          </div>

          {/* Result column */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Side-by-side regime cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "new", label: "New Regime", icon: TrendingDown, tax: newR.tax, taxable: newR.taxable },
                { key: "old", label: "Old Regime", icon: Landmark, tax: oldR.tax, taxable: oldR.taxable },
              ].map((r) => {
                const isWinner = r.key === winner;
                return (
                  <div
                    key={r.key}
                    className="rounded-2xl p-5 relative overflow-hidden"
                    style={{
                      background: isWinner ? c.text : "#FFFFFF",
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <r.icon size={16} color={isWinner ? "#FFFFFF" : c.textFaint} />
                      {isWinner && (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
                          style={{ background: "#FFFFFF", color: c.text }}
                        >
                          BETTER FIT
                        </span>
                      )}
                    </div>
                    <div className="text-xs mb-1" style={{ color: isWinner ? "#B8B8B8" : c.textFaint }}>
                      {r.label}
                    </div>
                    <div
                      className="text-2xl font-semibold tracking-tight"
                      style={{ color: isWinner ? "#FFFFFF" : c.text, fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {fmt(r.tax)}
                    </div>
                    <div className="text-xs mt-1.5" style={{ color: isWinner ? "#B8B8B8" : c.textFaint }}>
                      on {fmt(r.taxable)} taxable
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signature element: printed verdict receipt */}
            <div
              key={printKey}
              className="receipt-print rounded-lg overflow-hidden"
              style={{ border: `1px solid ${c.border}` }}
            >
              <div className="perf-top" style={{ background: c.text }} />
              <div
                className="px-6 py-6"
                style={{
                  background: "#FFFFFF",
                  color: c.text,
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              >
                <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: `1px dashed ${c.border}` }}>
                  <PiggyBank size={14} />
                  <span className="text-[11px] tracking-[0.15em] font-semibold uppercase">
                    FinTaxtic — Verdict Slip
                  </span>
                </div>

                <div className="text-[11px] uppercase tracking-wider opacity-60 mb-1">
                  Recommended regime
                </div>
                <div className="text-xl font-semibold mb-4">
                  {winner === "new" ? "New Tax Regime" : "Old Tax Regime"}
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                  <span className="opacity-60">Estimated tax</span>
                  <span className="text-right font-semibold">
                    {fmt(winner === "new" ? newR.tax : oldR.tax)}
                  </span>
                  <span className="opacity-60">Savings vs other regime</span>
                  <span className="text-right font-semibold">
                    {fmt(savings)}
                  </span>
                </div>

                <div className="pt-3" style={{ borderTop: `1px dashed ${c.border}` }}>
                  <div className="text-[11px] uppercase tracking-wider opacity-60 mb-1">
                    Reason
                  </div>
                  <p className="text-[13px] leading-relaxed min-h-[3.2em]">
                    {typedReason}
                    <span className="opacity-40">{typedReason.length < reason.length ? "▍" : ""}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 text-[10px] opacity-50" style={{ borderTop: `1px dashed ${c.border}` }}>
                  Estimate only · excludes surcharge & marginal relief · FY 2025–26 slabs
                </div>
              </div>
              <div className="perf-bottom" style={{ background: c.text }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
