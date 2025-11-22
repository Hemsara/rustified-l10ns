import { ScanStep } from "../../types";
import { CheckIcon, FileIcon, DartIcon } from "../../assets/icons";

interface ProgressPanelProps {
  scanSteps: ScanStep[];
  currentFile: string | null;
  scanProgress: { current: number; total: number } | null;
  isScanning: boolean;
  selectedLanguages: string[];
}

export const ProgressPanel = ({
  scanSteps,
  currentFile,
  isScanning,
  selectedLanguages,
}: ProgressPanelProps) => {
  const getFileName = (path: string) => {
    return path.split("/").pop() || path;
  };

  return (
    <div className="w-72 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 overflow-y-auto">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        Progress
      </h3>

      <div className="space-y-3 mb-6">
        {scanSteps.map((step) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {step.status === "completed" && (
                <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
              )}
              {step.status === "scanning" && (
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
              )}
              {step.status === "pending" && (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`text-sm ${step.status === "pending"
                  ? "text-gray-400 dark:text-gray-500"
                  : step.status === "scanning"
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                  }`}
              >
                {step.label}
              </div>
              {step.status === "scanning" && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  In progress...
                </div>
              )}
              {currentFile && step.status === "scanning" && step.id === "2" && (
                <>
                  <div className="w-full my-5 h-[px] bg-slate-200"></div>
                  <div className="text-xs flex gap-2 text-gray-500 dark:text-gray-400 mt-0.5">
                    <span>Scraping</span>
                    <div className="px-1 bg-gray-200 dark:bg-gray-700 rounded flex items-center gap-1">
                      <DartIcon className="w-3 h-3" />
                      {getFileName(currentFile)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isScanning && selectedLanguages.length > 0 && (
        <div className="card rounded-md p-3">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Files to Generate
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2 font-mono">
            {selectedLanguages.map((lang) => (
              <div key={lang} className="flex items-center gap-2">
                <FileIcon className="w-4 h-4 text-gray-500" />
                <span>app_{lang}.arb</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            Location: /l10n
          </div>
        </div>
      )}
    </div>
  );
};
