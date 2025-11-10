import { useState } from "react";
import {
  Calculator,
  TrendingDown,
  FileText,
  User,
  Briefcase,
  Clock,
  CheckCircle2,
  IndianRupee,
  Shield,
  Target,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function TaxReducer() {
  const [form, setForm] = useState({
    taxAmount: "",
    age: "",
    profession: "",
    previousRecords: "",
    occupation: "",
    otherInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [taxCalc, setTaxCalc] = useState({
    income: "",
    regime: "new",
    deductions: "",
  });
  const [taxResult, setTaxResult] = useState(null);

  const calculateTax = () => {
    const income = parseFloat(taxCalc.income) || 0;
    const deductions = parseFloat(taxCalc.deductions) || 0;
    const taxableIncome = Math.max(0, income - deductions);

    let tax = 0;
    let breakdown = [];

    if (taxCalc.regime === "new") {
      // New Tax Regime (FY 2024-25)
      if (taxableIncome <= 300000) {
        tax = 0;
        breakdown.push({ slab: "Up to ₹3,00,000", rate: "0%", amount: 0 });
      } else if (taxableIncome <= 700000) {
        tax = (taxableIncome - 300000) * 0.05;
        breakdown.push({
          slab: "₹3,00,001 - ₹7,00,000",
          rate: "5%",
          amount: tax,
        });
      } else if (taxableIncome <= 1000000) {
        tax = 20000 + (taxableIncome - 700000) * 0.1;
        breakdown.push(
          { slab: "₹3,00,001 - ₹7,00,000", rate: "5%", amount: 20000 },
          {
            slab: "₹7,00,001 - ₹10,00,000",
            rate: "10%",
            amount: (taxableIncome - 700000) * 0.1,
          },
        );
      } else if (taxableIncome <= 1200000) {
        tax = 50000 + (taxableIncome - 1000000) * 0.15;
        breakdown.push(
          { slab: "₹3,00,001 - ₹10,00,000", rate: "5-10%", amount: 50000 },
          {
            slab: "₹10,00,001 - ₹12,00,000",
            rate: "15%",
            amount: (taxableIncome - 1000000) * 0.15,
          },
        );
      } else if (taxableIncome <= 1500000) {
        tax = 80000 + (taxableIncome - 1200000) * 0.2;
        breakdown.push(
          { slab: "₹3,00,001 - ₹12,00,000", rate: "5-15%", amount: 80000 },
          {
            slab: "₹12,00,001 - ₹15,00,000",
            rate: "20%",
            amount: (taxableIncome - 1200000) * 0.2,
          },
        );
      } else {
        tax = 140000 + (taxableIncome - 1500000) * 0.3;
        breakdown.push(
          { slab: "₹3,00,001 - ₹15,00,000", rate: "5-20%", amount: 140000 },
          {
            slab: "Above ₹15,00,000",
            rate: "30%",
            amount: (taxableIncome - 1500000) * 0.3,
          },
        );
      }
    } else {
      // Old Tax Regime
      if (taxableIncome <= 250000) {
        tax = 0;
        breakdown.push({ slab: "Up to ₹2,50,000", rate: "0%", amount: 0 });
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
        breakdown.push({
          slab: "₹2,50,001 - ₹5,00,000",
          rate: "5%",
          amount: tax,
        });
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2;
        breakdown.push(
          { slab: "₹2,50,001 - ₹5,00,000", rate: "5%", amount: 12500 },
          {
            slab: "₹5,00,001 - ₹10,00,000",
            rate: "20%",
            amount: (taxableIncome - 500000) * 0.2,
          },
        );
      } else {
        tax = 112500 + (taxableIncome - 1000000) * 0.3;
        breakdown.push(
          { slab: "₹2,50,001 - ₹10,00,000", rate: "5-20%", amount: 112500 },
          {
            slab: "Above ₹10,00,000",
            rate: "30%",
            amount: (taxableIncome - 1000000) * 0.3,
          },
        );
      }
    }

    // Add 4% cess
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    setTaxResult({
      grossIncome: income,
      deductions,
      taxableIncome,
      tax,
      cess,
      totalTax,
      breakdown,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const extractCleanText = (text) =>
    text
      .replace(/[#*`_~\[\]]/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const extractSavings = (text) => {
    const match = text.match(/₹[\d,]+|up to [\d,]+|[\d,]+ lakh/i);
    return match ? match[0] : "Available";
  };

  const parseAIResponse = (rawText) => {
    const cleaned = extractCleanText(rawText);
    const lines = cleaned.split("\n").filter((l) => l.trim());

    const policies = [];
    const recommendations = [];
    let summary = "";
    let potentialSavings = "";
    let currentSection = "";
    let buffer = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lowerLine = line.toLowerCase();

      if (
        lowerLine.includes("section 80") ||
        lowerLine.includes("hra") ||
        lowerLine.includes("nps") ||
        lowerLine.includes("ppf") ||
        lowerLine.includes("elss") ||
        lowerLine.includes("insurance") ||
        lowerLine.includes("home loan") ||
        lowerLine.includes("education loan")
      ) {
        if (buffer && currentSection === "policy") {
          const parts = buffer.split(":");
          policies.push({
            name: parts[0] || "Tax Deduction",
            description: parts[1] || buffer,
            savings: extractSavings(buffer),
          });
        }
        currentSection = "policy";
        buffer = line;
      } else if (
        lowerLine.includes("recommend") ||
        lowerLine.includes("suggest") ||
        lowerLine.includes("should") ||
        lowerLine.includes("consider")
      ) {
        currentSection = "recommendation";
        recommendations.push(line.replace(/^[-•*]\s*/, ""));
      } else if (
        (lowerLine.includes("save") ||
          lowerLine.includes("₹") ||
          lowerLine.includes("rs")) &&
        !potentialSavings
      ) {
        potentialSavings = line;
      } else if (currentSection === "policy") {
        buffer += " " + line;
      } else if (!summary && line.length > 50) {
        summary = line;
      }
    }

    if (buffer && currentSection === "policy") {
      const parts = buffer.split(":");
      policies.push({
        name: parts[0] || "Tax Deduction",
        description: parts[1] || buffer,
        savings: extractSavings(buffer),
      });
    }

    if (policies.length === 0) {
      const chunks = cleaned.split(/\d+\.|[-•*]/).filter((c) => c.trim());
      chunks.slice(0, 5).forEach((chunk) => {
        if (chunk.length > 20) {
          policies.push({
            name: chunk.substring(0, 50),
            description: chunk,
            savings: extractSavings(chunk),
          });
        }
      });
    }

    return {
      summary:
        summary ||
        "Based on your profile, here are applicable tax-saving options.",
      potentialSavings:
        potentialSavings ||
        "Potential savings calculated based on applicable deductions",
      policies: policies.slice(0, 8),
      recommendations: recommendations.slice(0, 5),
    };
  };

  const handleSubmit = async () => {
    if (!form.taxAmount || !form.age || !form.profession) {
      alert("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    const prompt = `You are a tax consultant. Analyze this tax situation:

Current Tax: ₹${form.taxAmount}
Age: ${form.age}
Profession: ${form.profession}
${form.previousRecords ? `Previous Records: ${form.previousRecords}` : ""}
${form.occupation ? `Occupation: ${form.occupation}` : ""}
${form.otherInfo ? `Additional Info: ${form.otherInfo}` : ""}

Provide:
1. List ALL applicable Indian tax deductions (Section 80C, 80D, HRA, NPS, etc.) with exact limits
2. Calculate potential savings with each deduction
3. Provide 3-5 actionable recommendations
4. Calculate total potential tax savings (include 10% advisory fee in final calculation)

Format your response clearly with policy names, descriptions, and amounts.`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const parsedResult = parseAIResponse(data.reply || "");
      setResult(parsedResult);
    } catch (err) {
      console.error(err);
      setResult({
        summary: "Error contacting the AI server.",
        potentialSavings: "N/A",
        policies: [],
        recommendations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
            <TrendingDown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Tax Reduction Calculator</h1>
          <p className="text-gray-600">
            Find applicable deductions and save on your taxes
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowCalculator(false)}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              !showCalculator
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Tax Optimizer
            </div>
          </button>
          <button
            onClick={() => setShowCalculator(true)}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              showCalculator
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5" />
              Tax Calculator
            </div>
          </button>
        </div>

        {!showCalculator ? (
          <>
            {/* Original Tax Reducer Form */}
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="taxAmount"
                    placeholder="Current Tax Amount (₹)"
                    value={form.taxAmount}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="age"
                    placeholder="Your Age"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="profession"
                  placeholder="Profession (e.g., Salaried, Business, Freelancer)"
                  value={form.profession}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="previousRecords"
                  placeholder="Previous Tax Records or Cases"
                  value={form.previousRecords}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                />
              </div>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation Details"
                  value={form.occupation}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                />
              </div>
              <textarea
                name="otherInfo"
                placeholder="Other Relevant Information"
                value={form.otherInfo}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors resize-none"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  "Calculate Tax Savings"
                )}
              </button>
            </div>

            {result && (
              <div className="space-y-6">
                <div className="bg-black text-white p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <IndianRupee className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Potential Savings</h2>
                  </div>
                  <p className="text-2xl font-bold">
                    {result.potentialSavings}
                  </p>
                  <p className="text-sm text-gray-300 mt-2">{result.summary}</p>
                </div>

                {result.policies.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5" />
                      <h3 className="text-xl font-bold">
                        Applicable Tax Policies
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.policies.map((policy, idx) => (
                        <div
                          key={idx}
                          className="border-2 border-gray-200 rounded-lg p-5 hover:border-black transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">
                              {policy.name}
                            </h4>
                            <span className="text-xs bg-black text-white px-2 py-1 rounded">
                              {policy.savings}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {policy.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5" />
                      <h3 className="text-xl font-bold">Recommendations</h3>
                    </div>
                    <div className="space-y-3">
                      {result.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg"
                        >
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <p className="text-sm leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Income Tax Calculator */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-black to-gray-800 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">
                  Income Tax Calculator
                </h2>
                <p className="text-gray-300 text-sm">
                  Calculate your tax liability as per Indian Income Tax rules
                </p>
              </div>

              <h3>
                You can also visit the government webiste here:{" "}
                <Link
                  href="http://incometaxindia.gov.in/pages/tools/tax-calculator.aspx/h3"
                  className="text-blue-500 underline cursor-pointer"
                >
                  Tax website
                </Link>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Gross Annual Income (₹)
                  </label>
                  <input
                    type="number"
                    value={taxCalc.income}
                    onChange={(e) =>
                      setTaxCalc({ ...taxCalc, income: e.target.value })
                    }
                    placeholder="e.g., 1000000"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tax Regime
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setTaxCalc({ ...taxCalc, regime: "new" })}
                      className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                        taxCalc.regime === "new"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      New Regime
                    </button>
                    <button
                      onClick={() => setTaxCalc({ ...taxCalc, regime: "old" })}
                      className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                        taxCalc.regime === "old"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Old Regime
                    </button>
                  </div>
                </div>

                {taxCalc.regime === "old" && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Deductions (₹) - 80C, 80D, etc.
                    </label>
                    <input
                      type="number"
                      value={taxCalc.deductions}
                      onChange={(e) =>
                        setTaxCalc({ ...taxCalc, deductions: e.target.value })
                      }
                      placeholder="e.g., 150000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: New regime doesn't allow most deductions
                    </p>
                  </div>
                )}

                <button
                  onClick={calculateTax}
                  className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Calculate Tax
                </button>
              </div>

              {taxResult && (
                <div className="space-y-4">
                  <div className="bg-black text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">
                      Tax Calculation Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Gross Income:</span>
                        <span className="font-bold">
                          ₹{taxResult.grossIncome.toLocaleString("en-IN")}
                        </span>
                      </div>
                      {taxCalc.regime === "old" && taxResult.deductions > 0 && (
                        <div className="flex justify-between text-green-300">
                          <span>Less: Deductions</span>
                          <span className="font-bold">
                            - ₹{taxResult.deductions.toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-gray-600 pt-3">
                        <span>Taxable Income:</span>
                        <span className="font-bold">
                          ₹{taxResult.taxableIncome.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Income Tax:</span>
                        <span>
                          ₹
                          {taxResult.tax.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health & Education Cess (4%):</span>
                        <span>
                          ₹
                          {taxResult.cess.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-3 text-xl">
                        <span className="font-bold">Total Tax Payable:</span>
                        <span className="font-bold text-yellow-300">
                          ₹
                          {taxResult.totalTax.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {taxResult.breakdown.length > 0 && (
                    <div className="border-2 border-gray-200 rounded-lg p-6">
                      <h4 className="font-bold mb-4">Tax Slab Breakdown</h4>
                      <div className="space-y-2">
                        {taxResult.breakdown.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                          >
                            <div>
                              <div className="font-semibold text-sm">
                                {item.slab}
                              </div>
                              <div className="text-xs text-gray-500">
                                Rate: {item.rate}
                              </div>
                            </div>
                            <span className="font-bold">
                              ₹
                              {item.amount.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> This is an approximate calculation.
                      Actual tax may vary based on surcharge (if applicable),
                      rebate u/s 87A, and other factors. Consult a tax
                      professional for accurate assessment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
