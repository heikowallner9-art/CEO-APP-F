export interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Completed";
  dueDate: string;
}

export interface Goal {
  id: string;
  title: string;
  progress: number; // 0 to 100
  kpi: string;      // e.g. "98% Client retention", "$50k Profit"
  milestones: string[]; // e.g. ["Draft Specs", "Approve Designs", "Launch Beta"]
  completedMilestones: string[]; // checked items
  category: string;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;      // e.g. 12
  consistency: number; // e.g. 88
  lastCompletedDate?: string; // ISO date
}

export interface BudgetEntry {
  id: string;
  description: string;
  amount: number; // numeric value
  type: "Income" | "Expense";
  date: string;
  category: "Operations" | "Luxury" | "Strategy" | "Travel" | "Other";
}

export interface Trip {
  id: string;
  destination: string;
  date: string;
  flightNo: string;
  status: "Planning" | "Confirmed" | "Completed";
  notes: string;
}

export interface ActiveContextState {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  budget: {
    balance: number;
    entries: BudgetEntry[];
  };
  trips: Trip[];
}
