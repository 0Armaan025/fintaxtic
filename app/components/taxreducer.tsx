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
} from "lucide-react";

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
              <p className="text-2xl font-bold">{result.potentialSavings}</p>
              <p className="text-sm text-gray-300 mt-2">{result.summary}</p>
            </div>

            {result.policies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Applicable Tax Policies</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.policies.map((policy, idx) => (
                    <div
                      key={idx}
                      className="border-2 border-gray-200 rounded-lg p-5 hover:border-black transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{policy.name}</h4>
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
      </div>
    </div>
  );
}
