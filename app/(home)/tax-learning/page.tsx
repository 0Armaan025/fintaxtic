"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Flame,
  Zap,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCcw,
  Check,
  ChevronRight,
  Heart,
  Target,
  Sliders,
} from "lucide-react";

// --- Types ---
interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Lesson {
  id: string;
  title: string;
  category: string;
  description: string;
  xp: number;
  readTime: string;
  content: string[];
  questions: Question[];
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredXP: number;
  requiredLessons?: number;
}

// --- Data ---
const LESSONS: Lesson[] = [
  {
    id: "regime-101",
    title: "Old vs. New Tax Regime",
    category: "Foundation",
    description: "Compare the two regimes and pick the right slab strategy for your income.",
    xp: 150,
    readTime: "3 min",
    content: [
      "The New Tax Regime offers lower rates but strips away classic deductions like HRA, LTA, and Section 80C.",
      "The Old Tax Regime features higher base rates but lets you claim up to ₹3.75L+ in stackable deductions.",
      "Rule of thumb: if your total deductions exceed ₹3.75 Lakhs, the Old Regime usually gives higher net savings.",
    ],
    questions: [
      {
        id: 1,
        question: "Which deduction is universally allowed under the New Tax Regime?",
        options: [
          "Section 80C Investments",
          "Standard Deduction (₹75,000 for salaried)",
          "HRA (House Rent Allowance)",
          "Section 80D Health Insurance",
        ],
        correctIndex: 1,
        explanation: "The ₹75,000 Standard Deduction is granted under the New Regime to ease salaried tax burdens.",
      },
      {
        id: 2,
        question: "At what deduction threshold does the Old Regime generally start winning?",
        options: ["₹1.0 Lakh", "₹2.0 Lakhs", "₹3.75 Lakhs", "₹5.0 Lakhs"],
        correctIndex: 2,
        explanation: "Once your stackable exemptions cross ~₹3.75 Lakhs, the Old Tax Regime usually saves more tax.",
      },
    ],
  },
  {
    id: "sec-80c",
    title: "Deduction Hunter: 80C",
    category: "Tax Savings",
    description: "Unlock up to ₹1,50,000 in legal tax shields using smart investment vehicles.",
    xp: 200,
    readTime: "4 min",
    content: [
      "Section 80C is the ultimate shield, capping at ₹1.5 Lakhs tax reduction per financial year.",
      "Top contenders: ELSS Funds (3-yr lock-in), PPF (15-yr lock-in), EPF, and NPS.",
      "ELSS mutual funds offer the shortest lock-in period (3 years) across all 80C instruments.",
    ],
    questions: [
      {
        id: 1,
        question: "Which 80C investment has the shortest mandatory lock-in period?",
        options: ["Public Provident Fund (PPF)", "Tax Saving Bank FD", "ELSS Mutual Funds", "National Savings Certificate"],
        correctIndex: 2,
        explanation: "ELSS Mutual Funds lock your capital for only 3 years compared to 5 years for FDs and 15 for PPF.",
      },
    ],
  },
  {
    id: "hra-exemption",
    title: "HRA Shield & Rent Hacks",
    category: "Salary Hacks",
    description: "Calculate house rent exemptions and legally claim rent paid to parents.",
    xp: 250,
    readTime: "5 min",
    content: [
      "HRA exemption equals the minimum of: Actual HRA, Rent minus 10% Basic, or 50% Basic (Metro city).",
      "Paying rent over ₹1,00,000 annually requires submitting your landlord's PAN card.",
      "You can pay rent to parents and claim HRA if they declare it in their IT returns.",
    ],
    questions: [
      {
        id: 1,
        question: "When is landlord PAN submission mandatory for claiming HRA?",
        options: ["Annual rent > ₹50,000", "Annual rent > ₹1,00,000", "Annual rent > ₹2,50,000", "Always required"],
        correctIndex: 1,
        explanation: "For rent payments exceeding ₹1,00,000/year (₹8,333/month), landlord PAN disclosure is mandatory.",
      },
    ],
  },
  {
    id: "capital-gains",
    title: "Capital Gains Arena",
    category: "Investing",
    description: "Navigate STCG vs LTCG tax rules on stocks, crypto, and real estate.",
    xp: 300,
    readTime: "5 min",
    content: [
      "Equity held over 12 months triggers Long Term Capital Gains (LTCG) tax.",
      "LTCG on equity exceeding ₹1.25 Lakhs per fiscal year is taxed at 12.5%.",
      "Short Term Capital Gains (STCG) on equity sold within 12 months carries a flat 20% tax.",
    ],
    questions: [
      {
        id: 1,
        question: "What holding duration qualifies equity mutual funds for Long Term Capital Gains (LTCG)?",
        options: ["6 Months", "12 Months", "24 Months", "36 Months"],
        correctIndex: 1,
        explanation: "Equity investments held past 12 months qualify as long-term capital assets.",
      },
    ],
  },
];

const BADGES: Badge[] = [
  { id: "rookie", title: "Tax Novice", description: "Complete your first tax module", icon: "🌱", requiredXP: 100, requiredLessons: 1 },
  { id: "hunter", title: "Deduction Hunter", description: "Accumulate 300+ XP in tax savings", icon: "🎯", requiredXP: 300 },
  { id: "strategist", title: "Tax Strategist", description: "Master 3 or more quest modules", icon: "⚡", requiredXP: 500, requiredLessons: 3 },
  { id: "grandmaster", title: "Fintaxtic Legend", description: "Reach Level 3 & earn 800+ XP", icon: "👑", requiredXP: 800 },
];

export default function TaxLearningPage() {
  const STORAGE_KEY = "fintaxtic_gamification_light_v1";

  const [xp, setXp] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(3);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeStep, setActiveStep] = useState<"reading" | "quiz" | "summary">("reading");

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [deductionAmount, setDeductionAmount] = useState(250000);
  const [userIncome, setUserIncome] = useState(1200000);

  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<Badge | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setXp(parsed.xp || 0);
        setHearts(parsed.hearts ?? 5);
        setStreak(parsed.streak || 3);
        setCompletedLessons(parsed.completedLessons || []);
      } catch (e) {
        console.error("Failed loading data", e);
      }
    }
  }, []);

  const saveProgress = (newXp: number, newCompleted: string[], newHearts: number) => {
    const data = { xp: newXp, streak, hearts: newHearts, completedLessons: newCompleted };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const userLevel = Math.floor(xp / 300) + 1;
  const currentLevelProgress = ((xp % 300) / 300) * 100;

  const handleStartLesson = (lesson: Lesson) => {
    if (hearts <= 0) {
      alert("Out of hearts. Review previous modules to recharge.");
      return;
    }
    setActiveLesson(lesson);
    setActiveStep("reading");
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizScore(0);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !activeLesson) return;
    setIsAnswered(true);
    const isCorrect = selectedOption === activeLesson.questions[currentQuestionIdx].correctIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    } else {
      const nextHearts = Math.max(0, hearts - 1);
      setHearts(nextHearts);
      saveProgress(xp, completedLessons, nextHearts);
    }
  };

  const handleNextQuestion = () => {
    if (!activeLesson) return;
    if (currentQuestionIdx + 1 < activeLesson.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishLesson();
    }
  };

  const finishLesson = () => {
    if (!activeLesson) return;
    const isFirstTime = !completedLessons.includes(activeLesson.id);
    let updatedXp = xp;
    let updatedCompleted = [...completedLessons];

    if (isFirstTime) {
      updatedXp += activeLesson.xp;
      updatedCompleted.push(activeLesson.id);
      setXp(updatedXp);
      setCompletedLessons(updatedCompleted);
      saveProgress(updatedXp, updatedCompleted, hearts);

      BADGES.forEach((b) => {
        if (updatedXp >= b.requiredXP && (!b.requiredLessons || updatedCompleted.length >= b.requiredLessons)) {
          const badgeKey = `badge_unlocked_${b.id}`;
          if (!localStorage.getItem(badgeKey)) {
            localStorage.setItem(badgeKey, "true");
            setNewBadgeUnlocked(b);
          }
        }
      });
    }
    setActiveStep("summary");
  };

  const handleResetData = () => {
    if (confirm("Reset all your learned modules, XP, and streak progress?")) {
      localStorage.removeItem(STORAGE_KEY);
      BADGES.forEach((b) => localStorage.removeItem(`badge_unlocked_${b.id}`));
      setXp(0);
      setHearts(5);
      setStreak(1);
      setCompletedLessons([]);
      setActiveLesson(null);
    }
  };

  const calcNewTax = (inc: number) => Math.max(0, (inc - 75000) * 0.15);
  const calcOldTax = (inc: number, ded: number) => Math.max(0, (inc - ded) * 0.2);
  const newTax = calcNewTax(userIncome);
  const oldTax = calcOldTax(userIncome, deductionAmount);
  const recommendedRegime = oldTax < newTax ? "Old Tax Regime" : "New Tax Regime";

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Badge Unlocked Modal */}
      {newBadgeUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg p-6 max-w-sm w-full text-center">
            <div className="text-5xl mb-3">{newBadgeUnlocked.icon}</div>
            <div className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-medium rounded mb-3 uppercase tracking-wide">
              Badge Unlocked
            </div>
            <h3 className="text-lg font-semibold text-black">{newBadgeUnlocked.title}</h3>
            <p className="text-xs text-gray-500 mt-2 mb-6">{newBadgeUnlocked.description}</p>
            <button
              onClick={() => setNewBadgeUnlocked(null)}
              className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Page container — no fixed/sticky positioning so it sits inline with a dashboard shell */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header row (in-flow, not sticky, so it won't overlap a sidebar/header) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide block">
              Tax Mastery
            </span>
            <h1 className="text-lg font-semibold text-black leading-tight">Level {userLevel} · {xp} XP</h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-gray-400" />
              {hearts}/5
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-gray-400" />
              {streak} day streak
            </span>
          </div>
        </div>

        {/* Level progress */}
        <div>
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1.5">
            <span>Progress to Level {userLevel + 1}</span>
            <span>{Math.round(currentLevelProgress)}%</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-black h-full rounded-full transition-all duration-500"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
        </div>

        {/* --- PATH LEARNING VIEW --- */}
        {!activeLesson && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Path */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-black flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" /> Lessons
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {completedLessons.length}/{LESSONS.length} complete
                  </span>
                  <button
                    onClick={handleResetData}
                    title="Reset Progress"
                    className="text-xs text-gray-400 hover:text-black flex items-center gap-1 underline"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {LESSONS.map((lesson, idx) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isLocked = idx > 0 && !completedLessons.includes(LESSONS[idx - 1].id);

                  return (
                    <div
                      key={lesson.id}
                      className={`border rounded-lg p-4 transition-colors ${isLocked ? "border-gray-100 bg-gray-50 opacity-60" : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 border ${isCompleted
                              ? "bg-black text-white border-black"
                              : isLocked
                                ? "bg-white text-gray-400 border-gray-200"
                                : "bg-white text-black border-gray-300"
                              }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-4 h-4" /> : idx + 1}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded border border-gray-200 text-gray-500">
                                {lesson.category}
                              </span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> +{lesson.xp} XP
                              </span>
                            </div>
                            <h3 className="text-sm font-medium text-black">{lesson.title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{lesson.description}</p>
                          </div>
                        </div>

                        <button
                          disabled={isLocked}
                          onClick={() => handleStartLesson(lesson)}
                          className={`px-3 py-2 rounded-md font-medium text-xs transition flex items-center gap-1 border ${isCompleted
                            ? "bg-white text-black border-gray-300 hover:bg-gray-50"
                            : isLocked
                              ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                              : "bg-black text-white border-black hover:bg-gray-800"
                            }`}
                        >
                          {isCompleted ? "Replay" : isLocked ? "Locked" : "Start"}
                          {!isLocked && <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tax Simulator */}
              <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium text-black text-sm">Tax Regime Simulator</h3>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Annual Salary: ₹{(userIncome / 100000).toFixed(1)} Lakhs
                    </label>
                    <input
                      type="range"
                      min="600000"
                      max="3000000"
                      step="50000"
                      value={userIncome}
                      onChange={(e) => setUserIncome(Number(e.target.value))}
                      className="w-full accent-black bg-gray-200 rounded-lg h-1.5 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Planned Deductions: ₹{(deductionAmount / 100000).toFixed(2)} Lakhs
                    </label>
                    <input
                      type="range"
                      min="50000"
                      max="500000"
                      step="25000"
                      value={deductionAmount}
                      onChange={(e) => setDeductionAmount(Number(e.target.value))}
                      className="w-full accent-black bg-gray-200 rounded-lg h-1.5 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-4 rounded-md flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase text-gray-400 block">Recommended Regime</span>
                    <span className="text-sm font-medium text-black">{recommendedRegime}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase text-gray-400 block">Est. Difference</span>
                    <span className="text-sm text-black">
                      ~₹{Math.abs(Math.round(oldTax - newTax)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-medium text-black flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-500" /> Badges
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {BADGES.map((badge) => {
                    const isUnlocked =
                      xp >= badge.requiredXP && (!badge.requiredLessons || completedLessons.length >= badge.requiredLessons);

                    return (
                      <div
                        key={badge.id}
                        className={`p-3 rounded-md border text-center ${isUnlocked ? "border-gray-300 bg-white" : "border-gray-100 bg-gray-50 opacity-50"
                          }`}
                      >
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <h4 className="font-medium text-xs text-black truncate">{badge.title}</h4>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{badge.requiredXP} XP</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-black flex items-center gap-2">
                    <Flame className="w-4 h-4 text-gray-500" /> Streak
                  </h3>
                  <span className="text-xs text-gray-500">{streak} days</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, dIdx) => (
                    <div
                      key={dIdx}
                      className={`p-2 rounded text-center text-[10px] font-medium border ${dIdx < streak ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-400"
                        }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ACTIVE LESSON & QUIZ RUNNER --- */}
        {activeLesson && (
          <div className="max-w-2xl mx-auto border border-gray-200 rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-wide">{activeLesson.category}</span>
                <h2 className="text-lg font-semibold text-black">{activeLesson.title}</h2>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="text-xs font-medium px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Quit
              </button>
            </div>

            {/* Reading Step */}
            {activeStep === "reading" && (
              <div className="space-y-5">
                <div className="space-y-3">
                  {activeLesson.content.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 leading-relaxed flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p>{p}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveStep("quiz")}
                    className="w-full sm:w-auto px-5 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm"
                  >
                    Start Quiz (+{activeLesson.xp} XP) <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Step */}
            {activeStep === "quiz" && (
              <div className="space-y-5">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    Question {currentQuestionIdx + 1} of {activeLesson.questions.length}
                  </span>
                  <span className="text-black font-medium">Hearts: {hearts}/5</span>
                </div>

                <h3 className="text-sm font-medium text-black">
                  {activeLesson.questions[currentQuestionIdx].question}
                </h3>

                <div className="space-y-2">
                  {activeLesson.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrect = oIdx === activeLesson.questions[currentQuestionIdx].correctIndex;

                    let btnStyle = "bg-white border border-gray-300 text-black hover:bg-gray-50";
                    if (isAnswered) {
                      if (isCorrect) btnStyle = "bg-black text-white border-black font-medium";
                      else if (isSelected) btnStyle = "bg-gray-50 border-gray-200 text-gray-400 line-through";
                      else btnStyle = "bg-white border-gray-100 text-gray-300";
                    } else if (isSelected) {
                      btnStyle = "bg-gray-50 border border-black text-black font-medium";
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswered}
                        onClick={() => setSelectedOption(oIdx)}
                        className={`w-full p-3.5 rounded-md text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="p-4 rounded-md bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium text-black block mb-1">Explanation</span>
                    {activeLesson.questions[currentQuestionIdx].explanation}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  {!isAnswered ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={handleCheckAnswer}
                      className="w-full py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-40 transition text-sm"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition text-sm flex items-center justify-center gap-2"
                    >
                      {currentQuestionIdx + 1 < activeLesson.questions.length ? "Next Question" : "Finish"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Summary Step */}
            {activeStep === "summary" && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-black">Lesson complete</h3>
                <p className="text-sm text-gray-500">
                  You finished <strong className="text-black">{activeLesson.title}</strong>
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md font-medium text-black text-sm">
                  <Zap className="w-4 h-4" /> +{activeLesson.xp} XP earned
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="px-5 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition text-sm"
                  >
                    Back to lessons
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
