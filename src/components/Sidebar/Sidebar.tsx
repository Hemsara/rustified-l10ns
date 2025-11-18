import { Project, Language } from "../../types";
import { ProjectList } from "./ProjectList";
import { IgnorePatterns } from "./IgnorePatterns";
import { LanguageSelector } from "./LanguageSelector";
import { ApiKeyInput } from "./ApiKeyInput";
import { Footer } from "./Footer";

interface SidebarProps {
  projects: Project[];
  selectedProject: string;
  onSelectProject: (id: string) => void;
  onImport: () => void;
  ignoredPatterns: string[];
  onAddPattern: (pattern: string) => void;
  onRemovePattern: (pattern: string) => void;
  selectedLanguages: string[];
  availableLanguages: Language[];
  onOpenLanguageModal: () => void;
  openAiKey: string;
  onOpenAiKeyChange: (value: string) => void;
}

export const Sidebar = ({
  projects,
  selectedProject,
  onSelectProject,
  onImport,
  ignoredPatterns,
  onAddPattern,
  onRemovePattern,
  selectedLanguages,
  availableLanguages,
  onOpenLanguageModal,
  openAiKey,
  onOpenAiKeyChange,
}: SidebarProps) => {
  return (
    <aside className="sidebar w-64 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">
          Flutter L10n
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          ARB File Generator
        </p>
      </div>

      <ProjectList
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={onSelectProject}
        onImport={onImport}
      />

      <IgnorePatterns
        patterns={ignoredPatterns}
        onAdd={onAddPattern}
        onRemove={onRemovePattern}
      />

      <LanguageSelector
        selectedLanguages={selectedLanguages}
        availableLanguages={availableLanguages}
        onOpenModal={onOpenLanguageModal}
      />

      <ApiKeyInput
        value={openAiKey}
        onChange={onOpenAiKeyChange}
      />

      <Footer />
    </aside>
  );
};
