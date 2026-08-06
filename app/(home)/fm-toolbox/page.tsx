"use client";
import React, { useState, useMemo } from "react";
import {
  Calculator,
  FileText,
  ShieldAlert,
  TrendingUp,
  Upload,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  Zap,
  IndianRupee,
  PieChart,
  RefreshCw
} from "lucide-react";

// --- ACCURATE INDIAN TAX ENGINE (FY 2025-26 / FY 2026-27) ---

// Old Tax Regime Engine
const calculateOldRegimeTax = (grossIncome, deductions) => {
  const stdDeduction = 50000;
  const taxableIncome = Math.max(0, grossIncome - stdDeduction - deductions);

  let baseTax = 0;
  if (taxableIncome > 1000000) {
    baseTax += (taxableIncome - 1000000) * 0.3 + 112500;
  } else if (taxableIncome > 500000) {
    baseTax += (taxableIncome - 500000) * 0.2 + 12500;
  } else if (taxableIncome > 250000) {
    baseTax += (taxableIncome - 250000) * 0.05;
  }

  // Section 87A Rebate (Old Regime: Net Taxable Income <= 5L)
  if (taxableIncome <= 500000) {
    baseTax = 0;
  }

  const cess = baseTax * 0.04;
  return {
    stdDeduction,
    taxableIncome,
    baseTax,
    cess,
    totalTax: Math.round(baseTax + cess)
  };
};

// New Tax Regime Engine
const calculateNewRegimeTax = (grossIncome) => {
  const stdDeduction = 75000;
  const taxableIncome = Math.max(0, grossIncome - stdDeduction);

  let baseTax = 0;
  // Slabs: 0-4L: 0%, 4-8L: 5%, 8-12L: 10%, 12-16L: 15%, 16-20L: 20%, 20-24L: 25%, >24L: 30%
  if (taxableIncome > 2400000) {
    baseTax += (taxableIncome - 2400000) * 0.3 + 300000;
  } else if (taxableIncome > 2000000) {
    baseTax += (taxableIncome - 2000000) * 0.25 + 200000;
  } else if (taxableIncome > 1600000) {
    baseTax += (taxableIncome - 1600000) * 0.2 + 120000;
  } else if (taxableIncome > 1200000) {
    baseTax += (taxableIncome - 1200000) * 0.15 + 60000;
  } else if (taxableIncome > 800000) {
    baseTax += (taxableIncome - 800000) * 0.1 + 20000;
  } else if (taxableIncome > 400000) {
    baseTax += (taxableIncome - 400000) * 0.05;
  }

  // Section 87A Rebate under New Regime (Zero tax up to 12L taxable income)
  if (taxableIncome <= 1200000) {
    baseTax = 0;
  } else {
    // Statutory Marginal Relief for income slightly exceeding 12L
    const excessIncome = taxableIncome - 1200000;
    if (baseTax > excessIncome && taxableIncome <= 1275000) {
      baseTax = excessIncome;
    }
  }

  const cess = baseTax * 0.04;
  return {
    stdDeduction,
    taxableIncome,
    baseTax,
    cess,
    totalTax: Math.round(baseTax + cess)
  };
};

// Document Parsing Engine
interface ParsedTaxData {
  pan?: string;
  grossSalary?: number;
  sec80c?: number;
  sec80d?: number;
  hra?: number;
  basicPay?: number;
}

const parseDocumentTextLocal = (rawText: string): ParsedTaxData => {
  const extracted: ParsedTaxData = {};

  const panMatch = rawText.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
  if (panMatch) extracted.pan = panMatch[0];

  const salaryMatch = rawText.match(
    /(?:Gross Salary|Total Salary|Gross Income|Gross Amount)[:\s]*₹?\s*([0-9,]+)/i
  );
  if (salaryMatch) extracted.grossSalary = parseFloat(salaryMatch[1].replace(/,/g, ""));

  const sec80cMatch = rawText.match(/(?:80C|PF|ELSS|Life Insurance)[:\s]*₹?\s*([0-9,]+)/i);
  if (sec80cMatch) extracted.sec80c = parseFloat(sec80cMatch[1].replace(/,/g, ""));

  const sec80dMatch = rawText.match(/(?:80D|Medical|Health Insurance)[:\s]*₹?\s*([0-9,]+)/i);
  if (sec80dMatch) extracted.sec80d = parseFloat(sec80dMatch[1].replace(/,/g, ""));

  const hraMatch = rawText.match(/(?:HRA|House Rent Allowance)[:\s]*₹?\s*([0-9,]+)/i);
  if (hraMatch) extracted.hra = parseFloat(hraMatch[1].replace(/,/g, ""));

  const basicMatch = rawText.match(/(?:Basic Pay|Basic Salary)[:\s]*₹?\s*([0-9,]+)/i);
  if (basicMatch) extracted.basicPay = parseFloat(basicMatch[1].replace(/,/g, ""));

  return extracted;
}; export default function TaxOptimizerApp() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Input Data State
  const [formData, setFormData] = useState({
    basicSalary: 900000,
    hraReceived: 250000,
    rentPaid: 240000,
    isMetro: true,
    otherAllowance: 350000,
    sec80c: 150000,
    sec80dSelf: 25000,
    sec80dParents: 30000,
    sec80ccd: 50000,
    homeLoanInterest: 120000,
    otherDeductions: 0
  });

  // Calculate Gross Salary dynamically
  const grossSalary = useMemo(() => {
    return (
      Number(formData.basicSalary || 0) +
      Number(formData.hraReceived || 0) +
      Number(formData.otherAllowance || 0)
    );
  }, [formData.basicSalary, formData.hraReceived, formData.otherAllowance]);

  // Section 10(13A) Statutory HRA Exemption Calculator
  const hraExemption = useMemo(() => {
    if (!formData.rentPaid || !formData.hraReceived) return 0;
    const rentOverTenPercent = Math.max(
      0,
      formData.rentPaid - 0.1 * formData.basicSalary
    );
    const metroCap = formData.isMetro
      ? 0.5 * formData.basicSalary
      : 0.4 * formData.basicSalary;

    return Math.min(
      formData.hraReceived,
      rentOverTenPercent,
      metroCap
    );
  }, [formData]);

  // Total Old Regime Deductions
  const totalOldDeductions = useMemo(() => {
    const cDeduction = Math.min(150000, Number(formData.sec80c || 0));
    const dSelfCap = Math.min(25000, Number(formData.sec80dSelf || 0));
    const dParentsCap = Math.min(50000, Number(formData.sec80dParents || 0));
    const npsCap = Math.min(50000, Number(formData.sec80ccd || 0));
    const homeLoanCap = Math.min(200000, Number(formData.homeLoanInterest || 0));

    return (
      hraExemption +
      cDeduction +
      dSelfCap +
      dParentsCap +
      npsCap +
      homeLoanCap +
      Number(formData.otherDeductions || 0)
    );
  }, [formData, hraExemption]);

  // Compute Taxes
  const oldRegime = useMemo(
    () => calculateOldRegimeTax(grossSalary, totalOldDeductions),
    [grossSalary, totalOldDeductions]
  );
  const newRegime = useMemo(
    () => calculateNewRegimeTax(grossSalary),
    [grossSalary]
  );

  const taxDifference = oldRegime.totalTax - newRegime.totalTax;
  const bestRegime = taxDifference > 0 ? "New Regime" : "Old Regime";

  // OCR / File Processing State
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [docParsedResult, setDocParsedResult] = useState<ParsedTaxData | null>(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessingDoc(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      setTimeout(() => {
        const parsed = parseDocumentTextLocal(text);
        setDocParsedResult(parsed);

        setFormData((prev) => ({
          ...prev,
          basicSalary: parsed.basicPay || prev.basicSalary,
          sec80c: parsed.sec80c || prev.sec80c,
          sec80dSelf: parsed.sec80d || prev.sec80dSelf,
          hraReceived: parsed.hra || prev.hraReceived,
          otherAllowance: parsed.grossSalary
            ? Math.max(0, parsed.grossSalary - (parsed.basicPay || 0) - (parsed.hra || 0))
            : prev.otherAllowance
        }));

        setIsProcessingDoc(false);
      }, 500);
    };

    reader.readAsText(file);
  };

  const loadSampleForm16 = () => {
    setIsProcessingDoc(true);
    setTimeout(() => {
      const sampleText = `
        FORM NO. 16 - Certificate under section 203 of Income-tax Act, 1961
        PAN of Employee: ABCDE1234F
        Gross Salary: ₹15,00,000
        Basic Pay: ₹9,00,000
        House Rent Allowance: ₹2,50,000
        Section 80C Investments (PF/ELSS): ₹1,50,000
        Section 80D Health Insurance: ₹25,000
      `;
      const parsed = parseDocumentTextLocal(sampleText);
      setDocParsedResult(parsed);

      setFormData((prev) => ({
        ...prev,
        basicSalary: 900000,
        hraReceived: 250000,
        otherAllowance: 350000,
        sec80c: 150000,
        sec80dSelf: 25000
      }));
      setIsProcessingDoc(false);
    }, 500);
  };

  // Tax Risk & Compliance Auditor
  const auditResults = useMemo(() => {
    const issues = [];

    if (formData.sec80c < 150000) {
      issues.push({
        type: "warning",
        category: "Underutilized Benefit",
        title: "Unclaimed Section 80C Limit",
        desc: `You have claimed ₹${Number(formData.sec80c).toLocaleString(
          "en-IN"
        )} out of the ₹1,50,000 limit. Investing ₹${(
          150000 - formData.sec80c
        ).toLocaleString("en-IN")} more reduces tax in the Old Regime.`
      });
    }

    if (formData.sec80ccd < 50000) {
      issues.push({
        type: "opportunity",
        category: "Tax Optimization",
        title: "Section 80CCD(1B) NPS Limit Unfilled",
        desc: `You can claim an additional ₹50,000 deduction for NPS under Section 80CCD(1B). You have ₹${(
          50000 - formData.sec80ccd
        ).toLocaleString("en-IN")} unused limit.`
      });
    }

    if (formData.rentPaid > 0 && formData.rentPaid <= 0.1 * formData.basicSalary) {
      issues.push({
        type: "critical",
        category: "HRA Rule Compliance",
        title: "Zero HRA Exemption Triggered",
        desc: "Annual rent paid is less than or equal to 10% of Basic Salary. Under Section 10(13A), your HRA exemption evaluates to ₹0."
      });
    }

    if (bestRegime === "New Regime" && totalOldDeductions > 250000) {
      issues.push({
        type: "warning",
        category: "Tax Regime Alignment",
        title: "New Regime Outperforms High Deductions",
        desc: `Even with ₹${totalOldDeductions.toLocaleString(
          "en-IN"
        )} in Old Regime deductions, the New Tax Regime saves ₹${Math.abs(
          taxDifference
        ).toLocaleString("en-IN")} due to lower slab rates.`
      });
    }

    if (newRegime.taxableIncome > 1200000 && newRegime.taxableIncome <= 1275000) {
      issues.push({
        type: "opportunity",
        category: "Marginal Relief",
        title: "Section 87A Marginal Relief Window",
        desc: "Taxable income is slightly above ₹12 Lakhs. Small salary restructuring or NPS contribution can drop tax liability to ₹0 under rebate."
      });
    }

    return issues;
  }, [formData, bestRegime, taxDifference, totalOldDeductions, newRegime]);

  // Financial Health Index Calculation
  const healthScore = useMemo(() => {
    let score = 50;
    if (formData.sec80c >= 150000) score += 15;
    else score += (formData.sec80c / 150000) * 10;

    if (formData.sec80dSelf > 0) score += 10;
    if (formData.sec80dParents > 0) score += 5;

    if (formData.sec80ccd >= 50000) score += 10;
    score += 10;

    return Math.min(100, Math.round(score));
  }, [formData]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-black text-white rounded-lg">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
                Indian Tax Suite <span className="text-xs bg-zinc-100 text-zinc-800 border border-zinc-300 px-2.5 py-1 rounded-full ml-2 font-medium">FY 2025–26 / 2026–27</span>
              </h1>
            </div>
            <p className="text-zinc-500 text-sm mt-1">
              Statutory Tax Engine • Old vs New Regime Analysis • Compliance Auditor
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 p-3 rounded-xl">
            <div className="text-right">
              <span className="text-xs text-zinc-500 block uppercase tracking-wider font-semibold">Optimal Tax Selection</span>
              <span className="text-sm font-bold text-black flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-black" /> Use {bestRegime} (Save ₹{Math.abs(taxDifference).toLocaleString("en-IN")})
              </span>
            </div>
          </div>
        </header>

        {/* NAVIGATION TABS */}
        <nav className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
          {[
            { id: "calculator", label: "Regime Comparator", icon: Calculator },
            { id: "ocr", label: "Form 16 / Payslip Auto-Fill", icon: FileText },
            { id: "audit", label: `Tax Audit & Compliance (${auditResults.length})`, icon: ShieldAlert },
            { id: "scorecard", label: "Financial Health Score", icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all border ${active
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-black"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* TAB 1: REGIME COMPARATOR & INPUTS */}
        {activeTab === "calculator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* INPUT PANEL */}
            <div className="lg:col-span-7 space-y-6 bg-zinc-50 border border-zinc-200 p-6 rounded-2xl">
              <h2 className="text-base font-bold text-black flex items-center gap-2 uppercase tracking-wide">
                <IndianRupee className="w-4 h-4 text-black" />
                Salary Breakup & HRA Inputs
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-medium">Basic Annual Salary (₹)</label>
                  <input
                    type="number"
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black font-mono transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-medium">HRA Received (Annual) (₹)</label>
                  <input
                    type="number"
                    value={formData.hraReceived}
                    onChange={(e) => setFormData({ ...formData, hraReceived: Number(e.target.value) })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black font-mono transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-medium">Other Allowances / Special Pay (₹)</label>
                  <input
                    type="number"
                    value={formData.otherAllowance}
                    onChange={(e) => setFormData({ ...formData, otherAllowance: Number(e.target.value) })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black font-mono transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-medium">Actual Rent Paid (Annual) (₹)</label>
                  <input
                    type="number"
                    value={formData.rentPaid}
                    onChange={(e) => setFormData({ ...formData, rentPaid: Number(e.target.value) })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black font-mono transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-zinc-700 block mb-1 font-medium">City Metro Status (for HRA cap)</label>
                  <select
                    value={formData.isMetro ? "metro" : "non-metro"}
                    onChange={(e) => setFormData({ ...formData, isMetro: e.target.value === "metro" })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black transition"
                  >
                    <option value="metro">Metro City (Delhi, Mumbai, Kolkata, Chennai - 50% Basic Cap)</option>
                    <option value="non-metro">Non-Metro City (40% Basic Cap)</option>
                  </select>
                </div>
              </div>

              <h2 className="text-base font-bold text-black pt-4 border-t border-zinc-200 flex items-center gap-2 uppercase tracking-wide">
                <PieChart className="w-4 h-4 text-black" />
                Old Tax Regime Deductions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-medium">Sec 80C (EPF, ELSS, PPF) [Max ₹1.5L]</label>
                  <input
                    type="number"
                    value={formData.sec80c}
                    onChange={(e) => setFormData({ ...formData, sec80c: Number(e.target.value) })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black font-mono transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-medium">Sec 80D Health Insurance (Self/Family)</label>
                  <input
                    type="number"
                    value={formData.sec80dSelf}
                    onChange={(e) => setFormData({ ...formData, sec80dSelf: Number(e.target.value) })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black font-mono transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-medium">Sec 80CCD(1B) NPS [Max ₹50k]</label>
                  <input
                    type="number"
                    value={formData.sec80ccd}
                    onChange={(e) => setFormData({ ...formData, sec80ccd: Number(e.target.value) })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black font-mono transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-700 block mb-1 font-medium">Home Loan Interest (Sec 24b) [Max ₹2L]</label>
                  <input
                    type="number"
                    value={formData.homeLoanInterest}
                    onChange={(e) => setFormData({ ...formData, homeLoanInterest: Number(e.target.value) })}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-black font-mono transition"
                  />
                </div>
              </div>
            </div>

            {/* SUMMARY & COMPARISON CARD */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                  <h3 className="text-base font-bold text-black uppercase tracking-wide">
                    Tax Comparison Summary
                  </h3>
                  <span className="text-xs font-mono bg-white text-black border border-zinc-300 px-2.5 py-1 rounded font-semibold">
                    Gross: ₹{grossSalary.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* OLD REGIME CARD */}
                  <div className={`p-4 rounded-xl border transition-all ${bestRegime === "Old Regime" ? "bg-black text-white border-black" : "bg-white text-zinc-900 border-zinc-300"}`}>
                    <span className={`text-[11px] font-bold block uppercase tracking-wider ${bestRegime === "Old Regime" ? "text-zinc-300" : "text-zinc-500"}`}>OLD TAX REGIME</span>
                    <span className="text-2xl font-black mt-1 block font-mono">
                      ₹{oldRegime.totalTax.toLocaleString("en-IN")}
                    </span>
                    <div className={`text-xs space-y-1 mt-3 pt-3 border-t font-mono ${bestRegime === "Old Regime" ? "border-zinc-800 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}>
                      <div>Std Deduct: ₹{oldRegime.stdDeduction.toLocaleString("en-IN")}</div>
                      <div>HRA Exempt: ₹{hraExemption.toLocaleString("en-IN")}</div>
                      <div>Deductions: ₹{totalOldDeductions.toLocaleString("en-IN")}</div>
                      <div>Taxable: ₹{oldRegime.taxableIncome.toLocaleString("en-IN")}</div>
                    </div>
                  </div>

                  {/* NEW REGIME CARD */}
                  <div className={`p-4 rounded-xl border transition-all ${bestRegime === "New Regime" ? "bg-black text-white border-black" : "bg-white text-zinc-900 border-zinc-300"}`}>
                    <span className={`text-[11px] font-bold block uppercase tracking-wider ${bestRegime === "New Regime" ? "text-zinc-300" : "text-zinc-500"}`}>NEW TAX REGIME</span>
                    <span className="text-2xl font-black mt-1 block font-mono">
                      ₹{newRegime.totalTax.toLocaleString("en-IN")}
                    </span>
                    <div className={`text-xs space-y-1 mt-3 pt-3 border-t font-mono ${bestRegime === "New Regime" ? "border-zinc-800 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}>
                      <div>Std Deduct: ₹{newRegime.stdDeduction.toLocaleString("en-IN")}</div>
                      <div>Exemptions: None</div>
                      <div>Taxable: ₹{newRegime.taxableIncome.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>

                {/* RECOMMENDATION BOX */}
                <div className="bg-white border border-zinc-300 p-4 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-black">
                      Recommendation: Choose {bestRegime}
                    </h4>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      Selecting the {bestRegime} reduces your annual tax payout by <strong className="text-black font-semibold">₹{Math.abs(taxDifference).toLocaleString("en-IN")}</strong>.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DOCUMENT AUTO-FILL */}
        {activeTab === "ocr" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-black flex items-center gap-2">
                    <FileText className="w-5 h-5 text-black" />
                    Browser-Native Document Reader
                  </h2>
                  <p className="text-sm text-zinc-600 mt-1">
                    Extract values from Form 16 or Payslips locally in your browser.
                  </p>
                </div>

                <button
                  onClick={loadSampleForm16}
                  className="px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded-lg text-sm font-medium transition flex items-center gap-2 shrink-0"
                >
                  <RefreshCw className="w-4 h-4" /> Load Sample Form 16 Text
                </button>
              </div>

              {/* UPLOAD AREA */}
              <div className="border-2 border-dashed border-zinc-300 hover:border-black transition rounded-xl p-8 text-center bg-white relative">
                <input
                  type="file"
                  accept=".txt,.csv,.json,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-black">
                  Click or drag Form 16 / Payslip text file here
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  100% Local Engine • No data leaves your machine
                </p>
              </div>

              {/* PROCESSING STATE */}
              {isProcessingDoc && (
                <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl border border-zinc-200 text-black">
                  <RefreshCw className="w-5 h-5 animate-spin text-black" />
                  <span className="text-sm font-medium">Parsing Document Text...</span>
                </div>
              )}

              {/* PARSED RESULTS */}
              {docParsedResult && !isProcessingDoc && (
                <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-black flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-black" /> Extracted & Auto-Filled Parameters
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    {Object.entries(docParsedResult).map(([key, value]) => (
                      <div key={key} className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                        <span className="text-zinc-500 uppercase font-semibold text-[10px] tracking-wider block">
                          {key}
                        </span>
                        <span className="text-black font-bold font-mono text-sm mt-0.5 block">
                          {typeof value === "number" ? `₹${value.toLocaleString("en-IN")}` : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TAX AUDIT ENGINE */}
        {activeTab === "audit" && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-2">
              <h2 className="text-lg font-bold text-black flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-black" />
                Income Tax Compliance & Optimization Audit
              </h2>
              <p className="text-sm text-zinc-600">
                Automated check against Indian Income Tax Department provisions to flag unutilized deductions and errors.
              </p>
            </div>

            <div className="space-y-3">
              {auditResults.length === 0 ? (
                <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200 text-black">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-black" />
                  <p className="font-bold text-base">No Audit Risks Detected</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Your current claims and tax regime selection follow standard optimization guidelines.
                  </p>
                </div>
              ) : (
                auditResults.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border bg-white border-zinc-200 flex items-start gap-3.5"
                  >
                    {item.type === "critical" && <AlertTriangle className="w-5 h-5 text-black shrink-0 mt-0.5" />}
                    {item.type === "warning" && <HelpCircle className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />}
                    {item.type === "opportunity" && <Zap className="w-5 h-5 text-black shrink-0 mt-0.5" />}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-black">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-black">{item.title}</h4>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: FINANCIAL HEALTH SCORE */}
        {activeTab === "scorecard" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8">

              {/* SCORE CIRCLE */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-zinc-200"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * healthScore) / 100}
                    className="text-black transition-all duration-1000"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-black">{healthScore}</span>
                  <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wider">Out of 100</span>
                </div>
              </div>

              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-xl font-bold text-black">Tax Health Index</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Calculated using standard planning metrics across Section 80C, health insurance coverage (80D), and long-term pension planning (80CCD).
                </p>
                <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start font-mono">
                  <span className="text-xs bg-white text-black px-3 py-1 rounded-full border border-zinc-300">
                    80C Utilization: {Math.round((formData.sec80c / 150000) * 100)}%
                  </span>
                  <span className="text-xs bg-white text-black px-3 py-1 rounded-full border border-zinc-300">
                    NPS Shield: {formData.sec80ccd >= 50000 ? "Fully Claimed" : "Partial"}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
