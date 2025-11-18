import { Language } from "../../types";
import { getCountryFlagUrl } from "../../utils/flags";

interface LanguageSelectorProps {
  selectedLanguages: string[];
  availableLanguages: Language[];
  onOpenModal: () => void;
}

export const LanguageSelector = ({
  selectedLanguages,
  availableLanguages,
  onOpenModal,
}: LanguageSelectorProps) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <label className="text-xs font-medium text-gray-700 block mb-2">
        Target Languages
      </label>
      <div
        onClick={onOpenModal}
        className="w-full rounded-md px-3 py-2 cursor-pointer border border-gray-300 hover:border-gray-400 transition-colors bg-white min-h-10 flex flex-wrap gap-1.5 items-center"
      >
        {selectedLanguages.length > 0 ? (
          selectedLanguages.map((langCode) => {
            const lang = availableLanguages.find(l => l.code === langCode);
            return (
              <div
                key={langCode}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border border-gray-300 bg-gray-50"
              >
                <img
                  src={getCountryFlagUrl(langCode)}
                  alt={langCode}
                  className="w-4 h-3 object-cover rounded-sm"
                />
                <span className="text-gray-700">{lang?.name || langCode.toUpperCase()}</span>
              </div>
            );
          })
        ) : (
          <span className="text-sm text-gray-500">Select languages</span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {selectedLanguages.length} language{selectedLanguages.length !== 1 ? "s" : ""} selected
      </p>
    </div>
  );
};
