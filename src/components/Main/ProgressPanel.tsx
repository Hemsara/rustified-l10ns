import { ScanStep } from "../../types";

interface ProgressPanelProps {
  scanSteps: ScanStep[];
}

export const ProgressPanel = ({ scanSteps }: ProgressPanelProps) => {
  return (
    <div className="w-72 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        Progress
      </h3>

      <div className="space-y-3 mb-6">
        {scanSteps.map((step) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {step.status === "completed" && (
                <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {step.status === "scanning" && (
                <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-900 rounded-full animate-pulse" />
                </div>
              )}
              {step.status === "pending" && (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <div
                className={`text-sm ${
                  step.status === "pending"
                    ? "text-gray-400 dark:text-gray-500"
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
            </div>
          </div>
        ))}
      </div>

      <div className="card rounded-md p-3">
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Generated Files
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2 font-mono">
          <div className="flex items-center gap-2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy9ScF5x4t2KRmtbWswfPG8UbfZzt02enAKg&s"
              alt="File"
              className="w-3 h-3"
            />
            <span>app_en.arb</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy9ScF5x4t2KRmtbWswfPG8UbfZzt02enAKg&s"
              alt="File"
              className="w-3 h-3"
            />
            <span>app_es.arb</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy9ScF5x4t2KRmtbWswfPG8UbfZzt02enAKg&s"
              alt="File"
              className="w-3 h-3"
            />
            <span>app_fr.arb</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          Location: /l10n
        </div>
      </div>
    </div>
  );
};
