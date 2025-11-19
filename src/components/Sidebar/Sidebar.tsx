import { Project, Language } from "../../types";
import { ProjectList } from "./ProjectList";
import { IgnorePatterns } from "./IgnorePatterns";
import { LanguageSelector } from "./LanguageSelector";
import { ApiKeyInput } from "./ApiKeyInput";
import { Footer } from "./Footer";
import { useTheme } from "../../context/ThemeContext";

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
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar w-64 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Flutter L10n
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ARB File Generator
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
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
