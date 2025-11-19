import { useState, useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Project, ScanStep, Translation, Language, ExtractedString } from "./types";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Main/Header";
import { ProgressPanel } from "./components/Main/ProgressPanel";
import { TranslationsTable } from "./components/Main/TranslationsTable";
import { LanguageModal } from "./components/Modal/LanguageModal";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isScanning, setIsScanning] = useState(false);




  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedProject, setSelectedProject] = useState<string>("1");
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "en",
    "es",
    "fr",
  ]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [openAiKey, setOpenAiKey] = useState("");
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(
    translations.map((t) => t.key)
  );
  const [lastScanned, setLastScanned] = useState<string>("Never");
  const [ignoredPatterns, setIgnoredPatterns] = useState<string[]>([
    "*.test.dart",
    "*.g.dart",
  ]);
  const [scanSteps] = useState<ScanStep[]>([
    { id: "1", label: "Initializing scanner", status: "completed" },
    { id: "2", label: "Scanning Dart files", status: "pending" },
    { id: "3", label: "Extracting translations", status: "pending" },
    { id: "4", label: "Generating ARB files", status: "pending" },
  ]);

  useEffect(() => {
    fetch(
      "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0"
    )
      .then((res) => res.json())
      .then((data) => {
        const langs: Language[] = Object.entries(data.translation).map(
          ([code, info]: [string, any]) => ({
            code,
            name: info.name,
            nativeName: info.nativeName,
          })
        );
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

  const handleScan = async (path: string) => {
    if (!path) {
      toast.error("Please select a project first", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setIsScanning(true);
    try {
      const extractedStrings = await invoke<ExtractedString[]>("scan_dart_files", {
        dirPath: path
      });

      // Convert ExtractedString to Translation objects
      const newTranslations: Translation[] = extractedStrings.map((extracted) => ({
        key: extracted.key,
        value: extracted.value,
        source: extracted.file_name,
      }));

      setTranslations(newTranslations);
      setSelectedTranslations(newTranslations.map((t) => t.key));
      setLastScanned(new Date().toLocaleString());

      toast.success(`Found ${extractedStrings.length} strings!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
        transition: Bounce,
      });
    } catch (err) {
      console.error("Scan error:", err);
      toast.error(err instanceof Error ? err.message : String(err), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsScanning(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      setError(null);

      const list = await invoke<Array<{ path: string; name: string; description?: string }>>("get_projects");
      const projectsWithIds: Project[] = list.map((p, index) => ({
        id: (index + 1).toString(),
        name: p.name,
        path: p.path,
      }));
      setProjects(projectsWithIds);

      // Select first project if available and none selected
      if (projectsWithIds.length > 0) {
        setSelectedProject(projectsWithIds[0].id);
      }
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  const handleImport = async () => {
    const folder = await open({
      directory: true,
      multiple: false,
    });

    if (!folder || typeof folder !== "string") return;

    console.log("Selected folder:", folder);

    try {
      const result: SelectedFolder = await invoke("validate_folder", {
        path: folder,
      });

      console.log("Validated folder:", result);
      setProjects((prev) => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          name: result.name,
          path: result.path,
          description: result.description,
        },
      ]);
      toast.success("Project imported successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (err) {
      console.error("Validation error:", err);
      toast.error(err instanceof Error ? err.message : String(err), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  interface SelectedFolder {
    path: string;
    name: string;
    description?: string;
  }

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

      <main className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        <Header
          projectName={
            projects.find((p) => p.id === selectedProject)?.name || ""
          }
          onScan={() => handleScan(projects.find((p) => p.id === selectedProject)?.path || "")}
          lastScanned={lastScanned}
        />

        <div className="flex-1 flex min-h-0">
          <ProgressPanel scanSteps={scanSteps} />
          <TranslationsTable
            translations={translations}
            selectedTranslations={selectedTranslations}
            onToggleTranslation={toggleTranslation}
            onToggleAll={toggleAllTranslations}
            isScanning={isScanning}
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

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
