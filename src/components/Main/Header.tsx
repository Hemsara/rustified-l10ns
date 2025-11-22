import { AppStep } from "../../types";
import { SpinnerIcon, SearchIcon, StopIcon, SparklesIcon } from "../../assets/icons";

interface HeaderProps {
  projectName: string;
  onScan: () => void;
  onStopScan: () => void;
  onGenerate: () => void;
  lastScanned: string;
  appStep: AppStep;
  scanProgress: { current: number; total: number } | null;
  hasApiKey: boolean;
  hasTranslations: boolean;
}

export const Header = ({
  projectName,
  onScan,
  onStopScan,
  onGenerate,
  lastScanned,
  appStep,
  scanProgress,
  hasApiKey,
  hasTranslations,
}: HeaderProps) => {
  const getButtonContent = () => {
    switch (appStep) {
      case "scanning":
        return {
          icon: <StopIcon className="w-4 h-4" />,
          text: "Stop Scan",
          onClick: onStopScan,
          disabled: false,
          className: "bg-red-500 hover:bg-red-600 text-white",
        };
      case "scanned":
        return {
          icon: <SparklesIcon className="w-4 h-4" />,
          text: "Generate via AI",
          onClick: onGenerate,
          disabled: !hasApiKey,
          className: hasApiKey ? "btn-primary" : "bg-gray-400 cursor-not-allowed text-white",
        };
      case "generating":
        return {
          icon: <SpinnerIcon className="w-4 h-4" />,
          text: "Generating...",
          onClick: () => {},
          disabled: true,
          className: "bg-gray-400 cursor-not-allowed text-white",
        };
      default:
        return {
          icon: <SearchIcon className="w-4 h-4" />,
          text: "Scan Project",
          onClick: onScan,
          disabled: false,
          className: "btn-primary",
        };
    }
  };

  const button = getButtonContent();

  return (
    <div>
      <header className="border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="px-8 py-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {projectName || "Select a project"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {appStep === "scanned" && hasTranslations
              ? "Strings extracted. Configure languages and generate translations."
              : "Scan Dart files and generate ARB translation files"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 px-8 py-4">
          <button
            onClick={button.onClick}
            disabled={button.disabled}
            className={`rounded-md px-5 py-2.5 text-sm font-medium flex items-center gap-2 transition-all ${button.className}`}
            title={appStep === "scanned" && !hasApiKey ? "API key required to generate translations" : undefined}
          >
            {button.icon}
            {button.text}
          </button>
          {appStep === "scanned" && !hasApiKey && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Add API key to generate
            </p>
          )}
          {appStep !== "scanned" && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last scanned: {lastScanned}
            </p>
          )}
        </div>
      </header>
      {scanProgress && appStep === "scanning" && (
        <div className="h-[3px]">
          <div
            className="h-[3px] bg-primary"
            style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};
