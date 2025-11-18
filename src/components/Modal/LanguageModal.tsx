import { useState } from "react";
import { Language } from "../../types";
import { getCountryFlagUrl } from "../../utils/flags";

interface LanguageModalProps {
  show: boolean;
  onClose: () => void;
  availableLanguages: Language[];
  selectedLanguages: string[];
  onToggleLanguage: (code: string) => void;
}

export const LanguageModal = ({
  show,
  onClose,
  availableLanguages,
  selectedLanguages,
  onToggleLanguage,
}: LanguageModalProps) => {
  const [languageSearch, setLanguageSearch] = useState("");

  if (!show) return null;

  const filteredLanguages = availableLanguages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(languageSearch.toLowerCase()) ||
      lang.code.toLowerCase().includes(languageSearch.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Select Target Languages
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose languages for translation
          </p>
        </div>

        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={languageSearch}
            onChange={(e) => setLanguageSearch(e.target.value)}
            placeholder="Search languages..."
            className="input-field w-full rounded-md px-4 py-2 text-sm"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-2">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onToggleLanguage(lang.code)}
                className={`text-left p-3 rounded-md border transition-all ${
                  selectedLanguages.includes(lang.code)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <img
                      src={getCountryFlagUrl(lang.code)}
                      alt={lang.code}
                      className="w-6 h-4 object-cover rounded-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {lang.name}
                      </div>
                      <div className="text-xs mt-0.5 text-gray-500 truncate">
                        {lang.nativeName} ({lang.code})
                      </div>
                    </div>
                  </div>
                  {selectedLanguages.includes(lang.code) && (
                    <svg
                      className="w-5 h-5 shrink-0 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {selectedLanguages.length} language{selectedLanguages.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="btn-secondary rounded-md px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="btn-primary rounded-md px-4 py-2 text-sm font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
