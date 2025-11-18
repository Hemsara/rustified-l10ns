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
