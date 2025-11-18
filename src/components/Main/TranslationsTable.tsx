import { Translation } from "../../types";

interface TranslationsTableProps {
  translations: Translation[];
  selectedTranslations: string[];
  onToggleTranslation: (key: string) => void;
  onToggleAll: () => void;
}

export const TranslationsTable = ({
  translations,
  selectedTranslations,
  onToggleTranslation,
  onToggleAll,
}: TranslationsTableProps) => {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-8 py-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">
          Discovered Strings ({translations.length})
        </h3>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-10 py-2.5 px-4">
                <input
                  type="checkbox"
                  checked={selectedTranslations.length === translations.length}
                  onChange={onToggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
              </th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-700">
                Translation Key
              </th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-700">
                Content
              </th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody>
            {translations.map((translation, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedTranslations.includes(translation.key)}
                    onChange={() => onToggleTranslation(translation.key)}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                </td>
                <td className="py-3 px-4 font-mono text-xs text-gray-900">
                  {translation.key}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900">
                    {translation.value}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src="https://www.fluttericon.com/logo_dart_192px.svg"
                      alt="Dart"
                      className="w-3 h-3"
                    />
                    <span className="text-xs text-gray-500 font-mono">
                      {translation.source}
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
      </div>
    </div>
  );
};
