interface HeaderProps {
  projectName: string;
  onScan: () => void;
  lastScanned: string;
}

export const Header = ({ projectName, onScan, lastScanned }: HeaderProps) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {projectName || "Select a project"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Scan Dart files and generate ARB translation files
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={onScan}
          className="btn-primary rounded-md px-5 py-2.5 text-sm font-medium flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Scan Project
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last scanned: {lastScanned}
        </p>
      </div>
    </header>
  );
};
