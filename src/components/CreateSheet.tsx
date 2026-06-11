import React, { useState } from "react";
import { X, CheckSquare, Target, Zap, CircleDollarSign, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CreateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (type: "task" | "goal" | "habit" | "budget" | "trip", data: any) => void;
}

export default function CreateSheet({ isOpen, onClose, onCreate }: CreateSheetProps) {
  const [activeTab, setActiveTab] = useState<"task" | "goal" | "habit" | "budget" | "trip">("task");

  // Form states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("High");
  const [taskDueDate, setTaskDueDate] = useState("Today");

  const [goalTitle, setGoalTitle] = useState("");
  const [goalKpi, setGoalKpi] = useState("");
  const [goalCategory, setGoalCategory] = useState("Strategy");
  const [goalMilestones, setGoalMilestones] = useState("");

  const [habitTitle, setHabitTitle] = useState("");
  const [habitStreak, setHabitStreak] = useState(1);
  const [habitConsistency, setHabitConsistency] = useState(85);

  const [budgetDesc, setBudgetDesc] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetType, setBudgetType] = useState<"Income" | "Expense">("Expense");
  const [budgetCategory, setBudgetCategory] = useState<"Operations" | "Luxury" | "Strategy" | "Travel" | "Other">("Operations");

  const [tripDest, setTripDest] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [tripFlight, setTripFlight] = useState("");
  const [tripNotes, setTripNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "task") {
      if (!taskTitle.trim()) return;
      onCreate("task", {
        title: taskTitle,
        priority: taskPriority,
        dueDate: taskDueDate,
        status: "Active",
      });
      setTaskTitle("");
    } else if (activeTab === "goal") {
      if (!goalTitle.trim()) return;
      onCreate("goal", {
        title: goalTitle,
        kpi: goalKpi || "100% Finalized",
        category: goalCategory,
        milestones: goalMilestones ? goalMilestones.split(",").map(m => m.trim()).filter(Boolean) : ["Define Initiative"],
        completedMilestones: [],
        progress: 0,
      });
      setGoalTitle("");
      setGoalKpi("");
      setGoalMilestones("");
    } else if (activeTab === "habit") {
      if (!habitTitle.trim()) return;
      onCreate("habit", {
        title: habitTitle,
        streak: Number(habitStreak) || 1,
        consistency: Number(habitConsistency) || 85,
      });
      setHabitTitle("");
    } else if (activeTab === "budget") {
      if (!budgetDesc.trim() || !budgetAmount) return;
      onCreate("budget", {
        description: budgetDesc,
        amount: Math.abs(Number(budgetAmount)),
        type: budgetType,
        category: budgetCategory,
        date: new Date().toISOString().split("T")[0],
      });
      setBudgetDesc("");
      setBudgetAmount("");
    } else if (activeTab === "trip") {
      if (!tripDest.trim()) return;
      onCreate("trip", {
        destination: tripDest,
        date: tripDate || "TBD",
        flightNo: tripFlight || "Private Jet",
        notes: tripNotes,
        status: "Planning",
      });
      setTripDest("");
      setTripDate("");
      setTripFlight("");
      setTripNotes("");
    }
    onClose();
  };

  const tabsConfig = [
    { id: "task", name: "Task", icon: CheckSquare },
    { id: "goal", name: "Goal", icon: Target },
    { id: "habit", name: "Habit", icon: Zap },
    { id: "budget", name: "Financials", icon: CircleDollarSign },
    { id: "trip", name: "Trip Plan", icon: Compass },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 cursor-pointer"
            id="createsheet-backdrop"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto rounded-t-3xl border-t border-x border-amber-500/30 bg-[#0a0a0a]/95 p-6 md:p-8 z-50 max-h-[92vh] overflow-y-auto shadow-[0_-15px_40px_-5px_rgba(212,175,55,0.15)] select-none font-sans"
            id="createsheet-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="text-amber-400">⚡</span> Executive Command Provisioning
                </h3>
                <p className="text-xs text-gray-400 mt-1">Deploy high-leverage assets from the dashboard</p>
              </div>
              <button
                id="close-sheet-btn"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-amber-400 rounded-full hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Glassmorphic Tabs Selector */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-neutral-900/60 border border-white/5 mb-6">
              {tabsConfig.map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`sheet-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/40 shadow-inner"
                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "task" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                      Corporate Directive Description
                    </label>
                    <input
                      id="input-task-title"
                      type="text"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500"
                      placeholder="e.g. Sign legal agreement with Sovereign Wealth Syndicate..."
                      value={taskTitle}
                      onChange={e => setTaskTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Priority Hierarchy
                      </label>
                      <select
                        id="input-task-priority"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        value={taskPriority}
                        onChange={e => setTaskPriority(e.target.value as any)}
                      >
                        <option value="High">🔴 High Priority (Immediate)</option>
                        <option value="Medium">🟡 Medium Priority (Important)</option>
                        <option value="Low">🟢 Low Priority (Deferred)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Due Date Corridor
                      </label>
                      <input
                        id="input-task-due"
                        type="text"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        placeholder="e.g. Today, June 15"
                        value={taskDueDate}
                        onChange={e => setTaskDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "goal" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                      Venture Pillar (Goal Title)
                    </label>
                    <input
                      id="input-goal-title"
                      type="text"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      placeholder="e.g. Establish Sovereign Fund Consortium"
                      value={goalTitle}
                      onChange={e => setGoalTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Key Performance Indicator (KPI Target)
                      </label>
                      <input
                        id="input-goal-kpi"
                        type="text"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        placeholder="e.g. $15M commitments"
                        value={goalKpi}
                        onChange={e => setGoalKpi(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Executive Sector (Category)
                      </label>
                      <select
                        id="input-goal-category"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        value={goalCategory}
                        onChange={e => setGoalCategory(e.target.value)}
                      >
                        <option value="Strategy">♟️ Corporate Strategy</option>
                        <option value="Fundraising">💰 Capital & Venture</option>
                        <option value="Product">📦 Tech & Product</option>
                        <option value="Expansion">🌍 Global Scaling</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                      Strategic Milestones (Comma-separated checklist)
                    </label>
                    <input
                      id="input-goal-milestones"
                      type="text"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      placeholder="e.g. Setup syndicate, Draft investment memo, Confirm banking channels"
                      value={goalMilestones}
                      onChange={e => setGoalMilestones(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                      Separate each sub-milestone with a comma to populate the checklist.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "habit" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                      Elite Routine (Habit Title)
                    </label>
                    <input
                      id="input-habit-title"
                      type="text"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      placeholder="e.g. Daily Venture Portfolio Auditing"
                      value={habitTitle}
                      onChange={e => setHabitTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Current Streak Days
                      </label>
                      <input
                        id="input-habit-streak"
                        type="number"
                        min="0"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        value={habitStreak}
                        onChange={e => setHabitStreak(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Baseline Consistency Score (%)
                      </label>
                      <input
                        id="input-habit-consistency"
                        type="number"
                        min="0"
                        max="100"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        value={habitConsistency}
                        onChange={e => setHabitConsistency(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "budget" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                      Transaction Allocation Label
                    </label>
                    <input
                      id="input-budget-desc"
                      type="text"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      placeholder="e.g. B2B LinkedIn Campaign Retainer"
                      value={budgetDesc}
                      onChange={e => setBudgetDesc(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Amount ($ USD)
                      </label>
                      <input
                        id="input-budget-amount"
                        type="number"
                        min="1"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        placeholder="e.g. 1500"
                        value={budgetAmount}
                        onChange={e => setBudgetAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Venture Ledger Type
                      </label>
                      <select
                        id="input-budget-type"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        value={budgetType}
                        onChange={e => setBudgetType(e.target.value as any)}
                      >
                        <option value="Expense">🔴 Siphoned Fund (Expense)</option>
                        <option value="Income">🟢 Infused Fund (Income)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Sector Classification
                      </label>
                      <select
                        id="input-budget-category"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        value={budgetCategory}
                        onChange={e => setBudgetCategory(e.target.value as any)}
                      >
                        <option value="Operations">Operations</option>
                        <option value="Luxury">Luxury Core</option>
                        <option value="Strategy">Strategy</option>
                        <option value="Travel">Business Corridors</option>
                        <option value="Other">Opportunistic</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "trip" && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                      Global Tech Sector (Destination)
                    </label>
                    <input
                      id="input-trip-dest"
                      type="text"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      placeholder="e.g. Paris, France"
                      value={tripDest}
                      onChange={e => setTripDest(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Flight Window (Timeline)
                      </label>
                      <input
                        id="input-trip-date"
                        type="text"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        placeholder="e.g. July 12, 2026"
                        value={tripDate}
                        onChange={e => setTripDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                        Registered Flight Number / Operator
                      </label>
                      <input
                        id="input-trip-flight"
                        type="text"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                        placeholder="e.g. AF 022 / NetJets Gulfstream"
                        value={tripFlight}
                        onChange={e => setTripFlight(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-amber-400 uppercase mb-2">
                      Critical Intelligence Notes (Agendas, Key Targets)
                    </label>
                    <textarea
                      id="input-trip-notes"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 h-24 resize-none"
                      placeholder="e.g. Meet with APAC strategic partner regarding localized marketing metrics, complete Shinjuku desk deal..."
                      value={tripNotes}
                      onChange={e => setTripNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  id="cancel-provision-btn"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all text-xs uppercase tracking-wider"
                >
                  Terminate Action
                </button>
                <button
                  type="submit"
                  id="submit-provision-btn"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20 text-xs uppercase tracking-wider transition-all"
                >
                  Authorized Deployment
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
