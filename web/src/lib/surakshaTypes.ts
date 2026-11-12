import { rewriteLoopbackHost } from "./localUrl";

export type KinoraTier = 1 | 2 | 3;

export type KinoraMode = "idle" | "companion" | "investigation" | "coordination";

export type KinoraLanguage = "hi-IN" | "en-IN";

export interface KinoraTurn {
  speaker: "parent" | "ally";
  text: string;
  agent?: string;
  at?: string;
}

export interface KinoraFamilyMember {
  id: string;
  name: string;
  relation: string;
  role?: "child" | "neighbour";
  availability: string;
  response_history?: unknown[];
}

export interface KinoraHistoryDay {
  day: number;
  date: string;
  wake_detected_at?: string | null;
  checkin_at?: string | null;
  deviation_score: number;
  notes?: string;
  simulated?: boolean;
}

export interface KinoraToday {
  date: string;
  wake_detected_at: string | null;
  im_okay_at?: string | null;
  activity_log: unknown[];
  call_log: unknown[];
  deviation_score: number;
  deviation_reasons: { code: string; weight: number; level: string }[];
  checkin_completed?: boolean;
  reminders_done?: number;
  past_wake_window?: boolean;
  simulated?: boolean;
}

export interface DeviationJudgment {
  concerning: boolean;
  severity: "none" | "low" | "medium" | "high" | "critical";
  confidence: number;
  reasons: string[];
  suggested_next: string;
}

export interface KinoraAlertView {
  id: string;
  created_at: string;
  kind: string;
  status: string;
  tier: number;
  judgment?: DeviationJudgment | null;
  escalation_id?: string | null;
}

export interface ConsentRule {
  id: string;
  audience: string;
  audience_name: string;
  topic: string;
  except_emergency: boolean;
  description: string;
  description_hi: string;
  status: "pending_confirm" | "active" | "revoked" | "declined" | "superseded";
  created_at: string;
}

export interface KinoraState {
  parent_id: string;
  parent_name: string;
  language?: KinoraLanguage;
  honesty: string;
  honesty_label?: string;
  history_simulated?: boolean;
  today_live?: boolean;
  baseline: {
    wake_window: [string, string];
    typical_first_contact_time?: string;
    typical_call_duration_sec?: number;
    vocal_baseline?: { avg_pause_ms?: number; avg_words_per_min?: number };
  };
  history: KinoraHistoryDay[];
  family_roster: KinoraFamilyMember[];
  today: KinoraToday;
  escalation_state: string;
  escalation_id?: string | null;
  tier: KinoraTier;
  tier_label: string;
  tier_narration: string;
  mode: KinoraMode | string;
  transcript: KinoraTurn[];
  last_decision: {
    responder?: string | null;
    summary?: string;
    ack?: string;
  } | null;
  open_alert?: KinoraAlertView | null;
  pending_rule?: ConsentRule | null;
  updated_at?: string;
}

export interface ProactiveMessage {
  id: string;
  audience: string;
  kind:
    | "morning"
    | "reminder"
    | "investigation"
    | "neighbour_question"
    | "family_note"
    | "family_update"
    | "escalation_ask"
    | "escalation_update"
    | "all_clear";
  title: string;
  body: string;
  data?: Record<string, string>;
  created_at: string;
}

export interface EscalationEvent {
  at: string;
  event: string;
  member?: string;
  by?: string;
  decision?: string;
  reason?: string;
}

export interface Escalation {
  id: string;
  alert_id: string;
  severity: string;
  status: string;
  current_contact?: string | null;
  responder?: string | null;
  contacted?: string[];
  created_at: string;
  timeline: EscalationEvent[];
}

/** The one screen whoever is on their way to her reads. Cedar decides which lines exist. */
export interface HandoffNote {
  escalation_id: string;
  severity?: string;
  status?: string;
  at?: string;
  parent_name?: string;
  headline: string;
  what_happened: string;
  checks: string[];
  facts: string[];
  withheld: string[];
  written_by: "ally" | "records" | "policy";
  emergency_number: string;
}

export const EMPTY_KINORA: KinoraState = {
  parent_id: "amma",
  parent_name: "Amma",
  language: "hi-IN",
  honesty: "Days before today are simulated history used to establish a baseline. Today is live.",
  history_simulated: true,
  today_live: true,
  baseline: { wake_window: ["06:30", "07:45"] },
  history: [],
  family_roster: [],
  today: {
    date: "",
    wake_detected_at: null,
    activity_log: [],
    call_log: [],
    deviation_score: 0,
    deviation_reasons: [],
  },
  escalation_state: "none",
  tier: 1,
  tier_label: "ask_parent_first",
  tier_narration: "Most days, Kinora says nothing at all.",
  mode: "companion",
  transcript: [],
  last_decision: null,
};

export function kinoraApiUrl(): string {
  return rewriteLoopbackHost(
    (process.env.NEXT_PUBLIC_KINORA_API_URL ??
      // The deployed environment still carries the old name; either one works.
      process.env.NEXT_PUBLIC_ALLY_API_URL ??
      "http://localhost:8002").replace(/\/$/, "")
  );
}
