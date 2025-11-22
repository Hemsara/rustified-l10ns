import { useState, useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Project, ScanStep, Translation, Language, ExtractedString, ProgressPayload, AppStep } from "./types";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Main/Header";
import { ProgressPanel } from "./components/Main/ProgressPanel";
import { TranslationsTable } from "./components/Main/TranslationsTable";
import { LanguageModal } from "./components/Modal/LanguageModal";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

function App() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [appStep, setAppStep] = useState<AppStep>("idle");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("1");
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [openAiKey, setOpenAiKey] = useState("");
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(
    translations.map((t) => t.key)
  );
  const [lastScanned, setLastScanned] = useState<string>("Never");
  const [ignoredPatterns, setIgnoredPatterns] = useState<string[]>([]);
  const [scanSteps, setScanSteps] = useState<ScanStep[]>([
    { id: "1", label: "Initializing scanner", status: "pending" },
    { id: "2", label: "Scanning Dart files", status: "pending" },
    { id: "3", label: "Extracting translations", status: "pending" },
    { id: "4", label: "Generating ARB files", status: "pending" },
  ]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<{ current: number; total: number } | null>(null);

  useEffect(() => {
    fetch(
      "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0"
    )
      .then((res) => res.json())
      .then((data) => {
        const langs: Language[] = Object.entries(data.translation).map(
          ([code, info]: [string, unknown]) => ({
            code,
            name: (info as { name: string }).name,
            nativeName: (info as { nativeName: string }).nativeName,
          })
        );
        setAvailableLanguages(langs);
      })
      .catch((err) => console.error("Failed to fetch languages:", err));
  }, []);

  useEffect(() => {
    const unlistenFns: UnlistenFn[] = [];

    const setupListeners = async () => {
      unlistenFns.push(
        await listen<ProgressPayload>("scan-started", () => {
          setAppStep("scanning");
          setTranslations([]);
          setScanSteps((prev) =>
            prev.map((step) =>
              step.id === "1"
                ? { ...step, status: "scanning" }
                : { ...step, status: "pending" }
            )
          );
        })
      );

      unlistenFns.push(
        await listen<ProgressPayload>("scan-file-started", (event) => {
          const { file, index, total } = event.payload;
          setCurrentFile(file);
          setScanProgress(index && total ? { current: index, total } : null);
          setScanSteps((prev) =>
            prev.map((step) => {
              if (step.id === "1") return { ...step, status: "completed" };
              if (step.id === "2") return { ...step, status: "scanning" };
              return step;
            })
          );
        })
      );

      unlistenFns.push(
        await listen<ProgressPayload>("scan-file-done", (event) => {
          const { index, total } = event.payload;
          setScanProgress(index && total ? { current: index, total } : null);
        })
      );

      unlistenFns.push(
        await listen<ExtractedString[]>("scan-complete", (event) => {
          const extractedStrings = event.payload;
          const newTranslations: Translation[] = extractedStrings.map((extracted) => ({
            key: extracted.key,
            value: extracted.value,
            source: extracted.file_name,
          }));

          setTranslations(newTranslations);
          setSelectedTranslations(newTranslations.map((t) => t.key));
          setLastScanned(new Date().toLocaleString());
          setAppStep("scanned");
          setCurrentFile(null);
          setScanProgress(null);
          setScanSteps((prev) =>
            prev.map((step, idx) =>
              idx < 3 ? { ...step, status: "completed" } : { ...step, status: "pending" }
            )
          );

          toast.success(`Found ${extractedStrings.length} strings!`, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            theme: "light",
            transition: Bounce,
          });
        })
      );

      unlistenFns.push(
        await listen<ProgressPayload>("scan-stopped", () => {
          setAppStep("idle");
          setCurrentFile(null);
          setScanProgress(null);
          setScanSteps((prev) =>
            prev.map((step) => ({ ...step, status: "pending" }))
          );
          toast.info("Scan stopped", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            theme: "light",
            transition: Bounce,
          });
        })
      );

      unlistenFns.push(
        await listen<ProgressPayload>("scan-error", (event) => {
          setAppStep("idle");
          setCurrentFile(null);
          setScanProgress(null);
          setScanSteps((prev) =>
            prev.map((step) => ({ ...step, status: "pending" }))
          );
          toast.error(event.payload.message || "Scan failed", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            theme: "light",
            transition: Bounce,
          });
        })
      );
    };

    setupListeners();

    return () => {
      unlistenFns.forEach((unlisten) => unlisten());
    };
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

    try {
      await invoke("scan_dart_files", { dirPath: path });
    } catch (err) {
      console.error("Scan error:", err);
      toast.error(err instanceof Error ? err.message : String(err), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleStopScan = async () => {
    try {
      await invoke("stop_scan");
    } catch (err) {
      console.error("Stop scan error:", err);
    }
  };

  const handleGenerate = async () => {
    if (!openAiKey) {
      toast.error("Please add an API key first", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (selectedLanguages.length === 0) {
      toast.error("Please select at least one language", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setAppStep("generating");
    // TODO: Implement AI generation logic here
    toast.info("Generation feature coming soon!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      theme: "light",
      transition: Bounce,
    });
    setAppStep("scanned");
  };

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    try {
      const list = await invoke<Array<{ path: string; name: string; description?: string }>>("get_projects");
      const projectsWithIds: Project[] = list.map((p, index) => ({
        id: (index + 1).toString(),
        name: p.name,
        path: p.path,
      }));
      setProjects(projectsWithIds);

      if (projectsWithIds.length > 0) {
        setSelectedProject(projectsWithIds[0].id);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
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
          onStopScan={handleStopScan}
          onGenerate={handleGenerate}
          lastScanned={lastScanned}
          scanProgress={scanProgress}
          appStep={appStep}
          hasApiKey={!!openAiKey}
          hasTranslations={translations.length > 0}
        />

        <div className="flex-1 flex min-h-0">
          <ProgressPanel
            scanSteps={scanSteps}
            currentFile={currentFile}
            scanProgress={scanProgress}
            isScanning={appStep === "scanning"}
            selectedLanguages={selectedLanguages}
          />
          <TranslationsTable
            translations={translations}
            selectedTranslations={selectedTranslations}
            onToggleTranslation={toggleTranslation}
            onToggleAll={toggleAllTranslations}
            isScanning={appStep === "scanning"}
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
