import { Project } from "../../types";
import { FolderIcon } from "../../assets/icons";

interface ProjectListProps {
  projects: Project[];
  selectedProject: string;
  onSelectProject: (id: string) => void;
  onImport: () => void;
}

export const ProjectList = ({
  projects,
  selectedProject,
  onSelectProject,
  onImport,
}: ProjectListProps) => {
  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">Projects</h2>
        <button
          onClick={onImport}
          className="btn-secondary rounded-md px-2 py-1 text-xs font-medium"
        >
          Import
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3">
            <FolderIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">No projects yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Import a Flutter project to get started
          </p>
          <button
            onClick={onImport}
            className="btn-primary rounded-md px-3 py-1.5 text-xs font-medium"
          >
            Import Project
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`rounded-md p-2.5 text-left flex items-center gap-3 transition-all ${selectedProject === project.id
                ? " dark:bg-gray-700/50"
                : "hover:bg-gray-100 dark:hover:bg-gray-700/30"
                }`}
            >
              <img
                src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${project.name}`}
                alt={project.name}
                className="w-10 h-10 rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className={`text-sm flex items-center gap-2 ${selectedProject === project.id ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-200"
                  }`}>
                  {selectedProject === project.id && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--color-primary)" }}></span>
                  )}
                  {project.name}
                </div>
                <div className="text-xs truncate mt-0.5 text-gray-500 dark:text-gray-400">
                  {project.path}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
