import { useState } from "react";

interface IgnorePatternsProps {
  patterns: string[];
  onAdd: (pattern: string) => void;
  onRemove: (pattern: string) => void;
}

export const IgnorePatterns = ({ patterns, onAdd, onRemove }: IgnorePatternsProps) => {
  const [newPattern, setNewPattern] = useState("");

  const handleAdd = () => {
    if (newPattern.trim() && !patterns.includes(newPattern.trim())) {
      onAdd(newPattern.trim());
      setNewPattern("");
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-2">
        Ignore Files/Extensions
      </label>
      <div className="flex gap-1 mb-2">
        <input
          type="text"
          value={newPattern}
          onChange={(e) => setNewPattern(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          placeholder="*.test.dart"
          className="input-field flex-1 rounded-md px-2 py-1.5 text-xs"
        />
        <button
          onClick={handleAdd}
          className="btn-secondary rounded-md px-2 py-1.5 text-xs"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {patterns.map((pattern) => (
          <div
            key={pattern}
            className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-xs flex items-center gap-1"
          >
            <span className="text-gray-700 dark:text-gray-300">{pattern}</span>
            <button
              onClick={() => onRemove(pattern)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
