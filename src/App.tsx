import { useState, useEffect } from "react";
import "./App.css";
import { Project, ScanStep, Translation, Language } from "./types";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Main/Header";
import { ProgressPanel } from "./components/Main/ProgressPanel";
import { TranslationsTable } from "./components/Main/TranslationsTable";
import { LanguageModal } from "./components/Modal/LanguageModal";

function App() {
  const [translations] = useState<Translation[]>([
    { key: "app.title", value: "Welcome to our app", source: "lib/main.dart" },
    { key: "app.subtitle", value: "Get started with localization", source: "lib/main.dart" },
    { key: "button.submit", value: "Submit", source: "lib/widgets/form.dart" },
    { key: "button.cancel", value: "Cancel", source: "lib/widgets/form.dart" },
    { key: "error.required", value: "This field is required", source: "lib/utils/validation.dart" },
  ]);

  const [projects] = useState<Project[]>([
    { id: "1", name: "My App", path: "/Users/vehanhemsara/Documents/MyFlutterApp" },
    { id: "2", name: "Website", path: "/Users/vehanhemsara/Documents/WebsiteProject" },
  ]);

  const [selectedProject, setSelectedProject] = useState<string>("1");
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en", "es", "fr"]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [openAiKey, setOpenAiKey] = useState("");
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(
    translations.map((t) => t.key)
  );
  const [lastScanned, setLastScanned] = useState<string>("Never");
  const [ignoredPatterns, setIgnoredPatterns] = useState<string[]>(["*.test.dart", "*.g.dart"]);
  const [scanSteps] = useState<ScanStep[]>([
    { id: "1", label: "Initializing scanner", status: "completed" },
    { id: "2", label: "Scanning Dart files", status: "scanning" },
    { id: "3", label: "Extracting translations", status: "pending" },
    { id: "4", label: "Generating ARB files", status: "pending" },
  ]);

  useEffect(() => {
    fetch("https://api.cognitive.microsofttranslator.com/languages?api-version=3.0")
      .then((res) => res.json())
      .then((data) => {
        const langs: Language[] = Object.entries(data.translation).map(([code, info]: [string, any]) => ({
          code,
          name: info.name,
          nativeName: info.nativeName,
        }));
        setAvailableLanguages(langs);
      })
      .catch((err) => console.error("Failed to fetch languages:", err));
  }, []);

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleTranslation = (key: string) => {
    setSelectedTranslations((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleAllTranslations = () => {
    if (selectedTranslations.length === translations.length) {
      setSelectedTranslations([]);
    } else {
      setSelectedTranslations(translations.map((t) => t.key));
    }
  };

  const addIgnorePattern = (pattern: string) => {
    if (!ignoredPatterns.includes(pattern)) {
      setIgnoredPatterns([...ignoredPatterns, pattern]);
    }
  };

  const removeIgnorePattern = (pattern: string) => {
    setIgnoredPatterns(ignoredPatterns.filter((p) => p !== pattern));
  };

  const handleScan = () => {
    setLastScanned(new Date().toLocaleString());
    console.log("Scanning...");
  };

  const handleImport = () => {
    console.log("Importing project...");
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onImport={handleImport}
        ignoredPatterns={ignoredPatterns}
        onAddPattern={addIgnorePattern}
        onRemovePattern={removeIgnorePattern}
        selectedLanguages={selectedLanguages}
        availableLanguages={availableLanguages}
        onOpenLanguageModal={() => setShowLanguageModal(true)}
        openAiKey={openAiKey}
        onOpenAiKeyChange={setOpenAiKey}
      />

      <main className="flex-1 flex flex-col bg-white">
        <Header
          projectName={projects.find(p => p.id === selectedProject)?.name || ""}
          onScan={handleScan}
          lastScanned={lastScanned}
        />

        <div className="flex-1 flex min-h-0">
          <ProgressPanel scanSteps={scanSteps} />
          <TranslationsTable
            translations={translations}
            selectedTranslations={selectedTranslations}
            onToggleTranslation={toggleTranslation}
            onToggleAll={toggleAllTranslations}
          />
        </div>
      </main>

      <LanguageModal
        show={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        availableLanguages={availableLanguages}
        selectedLanguages={selectedLanguages}
        onToggleLanguage={toggleLanguage}
      />
    </div>
  );
}

export default App;
