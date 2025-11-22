export interface Project {
  id: string;
  name: string;
  path: string;
}

export interface ScanStep {
  id: string;
  label: string;
  status: "pending" | "scanning" | "completed";
}

export interface Translation {
  key: string;
  value: string;
  source: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface ExtractedString {
  key: string;
  value: string;
  file_name: string;
}

export interface ProgressPayload {
  status: string;
  file: string | null;
  index: number | null;
  total: number | null;
  message: string | null;
}

export type AppStep = "idle" | "scanning" | "scanned" | "generating";
