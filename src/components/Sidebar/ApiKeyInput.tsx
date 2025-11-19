interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ApiKeyInput = ({ value, onChange }: ApiKeyInputProps) => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
        OpenAI API Key
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="sk-..."
        className="input-field w-full rounded-md px-3 py-2 text-sm"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        For AI-powered translations
      </p>
    </div>
  );
};
