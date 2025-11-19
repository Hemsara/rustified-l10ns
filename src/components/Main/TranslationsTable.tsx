import { Translation } from "../../types";

interface TranslationsTableProps {
  translations: Translation[];
  selectedTranslations: string[];
  onToggleTranslation: (key: string) => void;
  onToggleAll: () => void;
  isScanning?: boolean;
}

export const TranslationsTable = ({
  translations,
  selectedTranslations,
  onToggleTranslation,
  onToggleAll,
  isScanning = false,
}: TranslationsTableProps) => {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Discovered Strings ({translations.length})
        </h3>
      </div>

      <div className="flex-1 overflow-auto">
        {isScanning ? (
          <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-600 dark:text-gray-300 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-900 dark:text-white mb-2">
              Scanning project...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Analyzing Dart files and extracting translatable strings
            </p>
          </div>
        ) : translations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-900 dark:text-white mb-2">
              No strings discovered yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Scan your project to discover translatable strings in your Dart files
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Click "Scan Project" in the header to begin</span>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="w-10 py-2.5 px-4">
                  <input
                    type="checkbox"
                    checked={selectedTranslations.length === translations.length}
                    onChange={onToggleAll}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-gray-900 dark:bg-gray-700"
                  />
                </th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Translation Key
                </th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Content
                </th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {translations.map((translation, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedTranslations.includes(translation.key)}
                      onChange={() => onToggleTranslation(translation.key)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-gray-900 dark:bg-gray-700"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-900 dark:text-gray-100">
                    {translation.key}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {translation.value}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src="https://www.fluttericon.com/logo_dart_192px.svg"
                        alt="Dart"
                        className="w-3 h-3"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {translation.source.split("/").pop()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="btn-secondary rounded px-2.5 py-1 text-xs">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
