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
  BookOpen,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Heart,
  Target,
  Sliders,
  Sparkle
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
  badgeTag: string;
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
    description: "Battle of the regimes! Pick the optimal slab strategy for your income.",
    xp: 150,
    readTime: "3 min",
    badgeTag: "bg-indigo-100 text-indigo-700 border-indigo-300",
    content: [
      "The New Tax Regime offers lower rates but strips away classic deductions like HRA, LTA, and Section 80C.",
      "The Old Tax Regime features higher base rates but lets you claim up to ₹3.75L+ in stackable deductions.",
      "Golden Rule: If your total deductions exceed ₹3.75 Lakhs, Old Regime gives you higher net savings!"
    ],
    questions: [
      {
        id: 1,
        question: "Which deduction is universally allowed under the New Tax Regime?",
        options: [
          "Section 80C Investments",
          "Standard Deduction (₹75,000 for salaried)",
          "HRA (House Rent Allowance)",
          "Section 80D Health Insurance"
        ],
        correctIndex: 1,
        explanation: "The ₹75,000 Standard Deduction is granted under the New Regime to ease salaried tax burdens."
      },
      {
        id: 2,
        question: "At what deduction threshold does the Old Regime generally start winning?",
        options: ["₹1.0 Lakh", "₹2.0 Lakhs", "₹3.75 Lakhs", "₹5.0 Lakhs"],
        correctIndex: 2,
        explanation: "Once your stackable exemptions cross ~₹3.75 Lakhs, the Old Tax Regime usually saves more tax."
      }
    ]
  },
  {
    id: "sec-80c",
    title: "Deduction Hunter: 80C",
    category: "Tax Savings",
    description: "Unlock up to ₹1,50,000 in legal tax shields using smart investment vehicles.",
    xp: 200,
    readTime: "4 min",
    badgeTag: "bg-emerald-100 text-emerald-700 border-emerald-300",
    content: [
      "Section 80C is the ultimate shield, capping at ₹1.5 Lakhs tax reduction per financial year.",
      "Top contenders: ELSS Funds (3-yr lock-in), PPF (15-yr lock-in), EPF, and NPS.",
      "Pro Tip: ELSS mutual funds offer the shortest lock-in period (3 years) across all 80C instruments!"
    ],
    questions: [
      {
        id: 1,
        question: "Which 80C investment has the shortest mandatory lock-in period?",
        options: ["Public Provident Fund (PPF)", "Tax Saving Bank FD", "ELSS Mutual Funds", "National Savings Certificate"],
        correctIndex: 2,
        explanation: "ELSS Mutual Funds lock your capital for only 3 years compared to 5 years for FDs and 15 for PPF."
      }
    ]
  },
  {
    id: "hra-exemption",
    title: "HRA Shield & Rent Hacks",
    category: "Salary Hacks",
    description: "Calculate house rent exemptions and legally claim rent paid to parents.",
    xp: 250,
    readTime: "5 min",
    badgeTag: "bg-amber-100 text-amber-700 border-amber-300",
    content: [
      "HRA exemption equals the minimum of: Actual HRA, Rent minus 10% Basic, or 50% Basic (Metro city).",
      "Paying rent over ₹1,00,000 annually requires submitting your landlord's PAN card.",
      "Family Hack: You can pay rent to parents and claim HRA if they declare it in their IT returns!"
    ],
    questions: [
      {
        id: 1,
        question: "When is landlord PAN submission mandatory for claiming HRA?",
        options: ["Annual rent > ₹50,000", "Annual rent > ₹1,00,000", "Annual rent > ₹2,50,000", "Always required"],
        correctIndex: 1,
        explanation: "For rent payments exceeding ₹1,00,000/year (₹8,333/month), landlord PAN disclosure is mandatory."
      }
    ]
  },
  {
    id: "capital-gains",
    title: "Capital Gains Arena",
    category: "Investing",
    description: "Navigate STCG vs LTCG tax rules on stocks, crypto, and real estate.",
    xp: 300,
    readTime: "5 min",
    badgeTag: "bg-rose-100 text-rose-700 border-rose-300",
    content: [
      "Equity held over 12 months triggers Long Term Capital Gains (LTCG) tax.",
      "LTCG on equity exceeding ₹1.25 Lakhs per fiscal year is taxed at 12.5%.",
      "Short Term Capital Gains (STCG) on equity sold within 12 months carries a flat 20% tax."
    ],
    questions: [
      {
        id: 1,
        question: "What holding duration qualifies equity mutual funds for Long Term Capital Gains (LTCG)?",
        options: ["6 Months", "12 Months", "24 Months", "36 Months"],
        correctIndex: 1,
        explanation: "Equity investments held past 12 months qualify as long-term capital assets."
      }
    ]
  }
];

const BADGES: Badge[] = [
  {
    id: "rookie",
    title: "Tax Novice",
    description: "Complete your first tax module",
    icon: "🌱",
    requiredXP: 100,
    requiredLessons: 1
  },
  {
    id: "hunter",
    title: "Deduction Hunter",
    description: "Accumulate 300+ XP in tax savings",
    icon: "🎯",
    requiredXP: 300
  },
  {
    id: "strategist",
    title: "Tax Strategist",
    description: "Master 3 or more quest modules",
    icon: "⚡",
    requiredXP: 500,
    requiredLessons: 3
  },
  {
    id: "grandmaster",
    title: "Fintaxtic Legend",
    description: "Reach Level 3 & earn 800+ XP",
    icon: "👑",
    requiredXP: 800
  }
];

export default function LightTaxLearningPage() {
  const STORAGE_KEY = "fintaxtic_gamification_light_v1";

  // Persistent State
  const [xp, setXp] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(3);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeStep, setActiveStep] = useState<"reading" | "quiz" | "summary">("reading");

  // Quiz Engine
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Scenario Simulator Widget State
  const [deductionAmount, setDeductionAmount] = useState(250000);
  const [userIncome, setUserIncome] = useState(1200000);

  // Visual Modals
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<Badge | null>(null);

  // Load state
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
      alert("Out of hearts! Review previous modules to recharge your energy.");
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

      // Check Badge Unlocks
      BADGES.forEach((b) => {
        if (
          updatedXp >= b.requiredXP &&
          (!b.requiredLessons || updatedCompleted.length >= b.requiredLessons)
        ) {
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

  // Reset Progress
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

  // Tax Simulator Logic
  const calcNewTax = (inc: number) => Math.max(0, (inc - 75000) * 0.15);
  const calcOldTax = (inc: number, ded: number) => Math.max(0, (inc - ded) * 0.20);
  const newTax = calcNewTax(userIncome);
  const oldTax = calcOldTax(userIncome, deductionAmount);
  const recommendedRegime = oldTax < newTax ? "Old Tax Regime" : "New Tax Regime";

  return (
    <div className="min-h-screen bg-white text-black pb-16 font-sans selection:bg-black selection:text-white">
      {/* Badge Unlocked Modal */}
      {newBadgeUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-black rounded-3xl p-6 max-w-sm w-full text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <div className="text-7xl mb-3 animate-bounce">{newBadgeUnlocked.icon}</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white font-extrabold text-xs rounded-full mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Badge Unlocked!
            </div>
            <h3 className="text-2xl font-black text-black">{newBadgeUnlocked.title}</h3>
            <p className="text-xs text-gray-600 mt-2 mb-6">{newBadgeUnlocked.description}</p>
            <button
              onClick={() => setNewBadgeUnlocked(null)}
              className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 active:translate-y-0.5 transition shadow-md"
            >
              Claim Trophy
            </button>
          </div>
        </div>
      )}

      {/* Top Gamified Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg shadow-md">
              F
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                Fintaxtic Academy
              </span>
              <h1 className="text-base font-black text-black leading-none">Tax Mastery Quest</h1>
            </div>
          </div>

          {/* Player Stats */}
          <div className="flex items-center gap-3">
            {/* Hearts */}
            <div className="flex items-center gap-1.5 bg-gray-50 border-2 border-black px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-black">{hearts}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-gray-50 border-2 border-black px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-black">{streak} Days</span>
            </div>

            {/* Level & XP */}
            <div className="flex items-center gap-2 bg-black text-white border-2 border-black px-3.5 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="text-white">{xp} XP</span>
              <span className="text-gray-400 text-[10px] hidden sm:inline">| Lvl {userLevel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-8">
        {/* Hero Level Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gray-50 border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs font-bold rounded-full mb-3">
                <Trophy className="w-3.5 h-3.5 text-amber-300" /> Season 1: Fiscal Mastery
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Level {userLevel} Tax Strategist
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md">
                Complete modules, solve real scenario quizzes, and stack rewards on your way to mastery.
              </p>
            </div>

            {/* Level Progress Bar */}
            <div className="w-full sm:w-64 bg-white border-2 border-black p-4 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center text-xs font-black mb-1.5">
                <span className="text-gray-600">Level Progress</span>
                <span className="text-black">{Math.round(currentLevelProgress)}%</span>
              </div>
              <div className="w-full bg-gray-100 border border-black h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-black h-full rounded-full transition-all duration-700"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- PATH LEARNING VIEW --- */}
        {!activeLesson && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Path (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-black flex items-center gap-2">
                  <Target className="w-5 h-5 text-black" /> Quest Trail
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500">
                    {completedLessons.length}/{LESSONS.length} Conquered
                  </span>
                  <button
                    onClick={handleResetData}
                    title="Reset Progress"
                    className="text-xs text-gray-400 hover:text-black flex items-center gap-1 underline font-medium"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>

              {/* Nodes Grid */}
              <div className="space-y-4">
                {LESSONS.map((lesson, idx) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isLocked = idx > 0 && !completedLessons.includes(LESSONS[idx - 1].id);

                  return (
                    <div
                      key={lesson.id}
                      className={`relative border-2 rounded-2xl p-5 transition-all duration-200 ${isCompleted
                        ? "bg-gray-50 border-gray-300"
                        : isLocked
                          ? "bg-gray-50 border-gray-200 opacity-60"
                          : "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Node Icon */}
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0 border-2 border-black ${isCompleted
                              ? "bg-emerald-100 text-emerald-800"
                              : isLocked
                                ? "bg-gray-200 text-gray-500 border-gray-400"
                                : "bg-black text-white"
                              }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                            ) : isLocked ? (
                              <Lock className="w-5 h-5" />
                            ) : (
                              idx + 1
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${lesson.badgeTag}`}
                              >
                                {lesson.category}
                              </span>
                              <span className="text-xs font-black text-black flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 fill-black" /> +{lesson.xp} XP
                              </span>
                            </div>

                            <h4 className="text-base font-black text-black">{lesson.title}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {lesson.description}
                            </p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          disabled={isLocked}
                          onClick={() => handleStartLesson(lesson)}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border-2 border-black ${isCompleted
                            ? "bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-400"
                            : isLocked
                              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                            }`}
                        >
                          {isCompleted ? "Replay" : isLocked ? "Locked" : "Start Quest"}
                          {!isLocked && <ChevronRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Tax Simulator Sandbox */}
              <div className="border-2 border-black bg-white rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-black" />
                    <h4 className="font-black text-black text-sm">Interactive Tax Regime Simulator</h4>
                  </div>
                  <span className="text-[10px] bg-black text-white font-bold px-2.5 py-1 rounded-full">
                    Live Sandbox
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Annual Salary: ₹{(userIncome / 100000).toFixed(1)} Lakhs
                    </label>
                    <input
                      type="range"
                      min="600000"
                      max="3000000"
                      step="50000"
                      value={userIncome}
                      onChange={(e) => setUserIncome(Number(e.target.value))}
                      className="w-full accent-black bg-gray-200 rounded-lg h-2 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Planned Deductions: ₹{(deductionAmount / 100000).toFixed(2)} Lakhs
                    </label>
                    <input
                      type="range"
                      min="50000"
                      max="500000"
                      step="25000"
                      value={deductionAmount}
                      onChange={(e) => setDeductionAmount(Number(e.target.value))}
                      className="w-full accent-black bg-gray-200 rounded-lg h-2 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Outcome Display */}
                <div className="bg-gray-50 border-2 border-black p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Recommended Optimal Regime
                    </span>
                    <span className="text-base font-black text-black">
                      {recommendedRegime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Estimated Tax Saving Difference
                    </span>
                    <span className="text-sm font-bold text-black">
                      ~₹{Math.abs(Math.round(oldTax - newTax)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Badges & Streak */}
            <div className="space-y-6">
              {/* Badges Cabinet */}
              <div className="border-2 border-black bg-white rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h3 className="text-sm font-black text-black flex items-center gap-2">
                  <Award className="w-4 h-4 text-black" /> Trophy Cabinet
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {BADGES.map((badge) => {
                    const isUnlocked =
                      xp >= badge.requiredXP &&
                      (!badge.requiredLessons || completedLessons.length >= badge.requiredLessons);

                    return (
                      <div
                        key={badge.id}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${isUnlocked
                          ? "bg-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-gray-50 border-gray-300 opacity-50"
                          }`}
                      >
                        <div className="text-3xl mb-1">{badge.icon}</div>
                        <h5 className="font-bold text-xs text-black truncate">{badge.title}</h5>
                        <span className="text-[10px] text-gray-500 font-bold block mt-0.5">
                          {badge.requiredXP} XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Streak Tracker */}
              <div className="border-2 border-black bg-white rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-black flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" /> Daily Streak
                  </h3>
                  <span className="text-xs font-bold text-black">{streak} Days Active</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 pt-2">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, dIdx) => (
                    <div
                      key={dIdx}
                      className={`p-2 rounded-lg text-center text-[10px] font-black border-2 ${dIdx < streak
                        ? "bg-black text-white border-black"
                        : "bg-gray-50 border-gray-200 text-gray-400"
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
          <div className="max-w-2xl mx-auto border-2 border-black rounded-3xl bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {activeLesson.category} Module
                </span>
                <h2 className="text-xl font-black text-black">{activeLesson.title}</h2>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="text-xs font-bold px-3 py-1.5 border-2 border-black rounded-xl hover:bg-gray-100"
              >
                Quit
              </button>
            </div>

            {/* Reading Step */}
            {activeStep === "reading" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  {activeLesson.content.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 border-2 border-black rounded-xl text-xs sm:text-sm text-gray-900 leading-relaxed flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p>{p}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveStep("quiz")}
                    className="w-full sm:w-auto px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 active:translate-y-0.5 transition flex items-center justify-center gap-2 text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                  >
                    Start Quiz Challenge (+{activeLesson.xp} XP) <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Step */}
            {activeStep === "quiz" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>
                    Question {currentQuestionIdx + 1} of {activeLesson.questions.length}
                  </span>
                  <span className="text-black font-black">Hearts: {hearts}/5</span>
                </div>

                <h3 className="text-base font-bold text-black">
                  {activeLesson.questions[currentQuestionIdx].question}
                </h3>

                <div className="space-y-2.5">
                  {activeLesson.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrect =
                      oIdx === activeLesson.questions[currentQuestionIdx].correctIndex;

                    let btnStyle = "bg-white border-2 border-black text-black hover:bg-gray-50";

                    if (isAnswered) {
                      if (isCorrect) btnStyle = "bg-black text-white border-black font-bold";
                      else if (isSelected) btnStyle = "bg-gray-100 border-gray-300 text-gray-400 line-through";
                      else btnStyle = "bg-gray-50 border-gray-200 text-gray-300";
                    } else if (isSelected) {
                      btnStyle = "bg-gray-100 border-2 border-black text-black font-extrabold";
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswered}
                        onClick={() => setSelectedOption(oIdx)}
                        className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="p-4 rounded-xl bg-gray-50 border-2 border-black text-xs text-gray-800 leading-relaxed">
                    <span className="font-black text-black block mb-1">Explanation:</span>
                    {activeLesson.questions[currentQuestionIdx].explanation}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  {!isAnswered ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={handleCheckAnswer}
                      className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-40 transition text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                    >
                      {currentQuestionIdx + 1 < activeLesson.questions.length ? "Next Question" : "Complete Quest"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Summary Step */}
            {activeStep === "summary" && (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-black text-white border-2 border-black rounded-3xl flex items-center justify-center mx-auto text-4xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                  🏆
                </div>
                <h3 className="text-2xl font-black text-black">Quest Completed!</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  You successfully mastered <strong>{activeLesson.title}</strong>!
                </p>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 border-2 border-black rounded-2xl font-black text-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Zap className="w-5 h-5 fill-black" /> +{activeLesson.xp} XP Earned
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                  >
                    Back to Learning Path
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
