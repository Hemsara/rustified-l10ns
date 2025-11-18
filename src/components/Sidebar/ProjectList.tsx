import { Project } from "../../types";

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
        <h2 className="text-sm font-medium text-gray-700">Projects</h2>
        <button
          onClick={onImport}
          className="btn-secondary rounded-md px-2 py-1 text-xs font-medium"
        >
          Import
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`rounded-md p-2.5 text-left flex items-center gap-3 transition-all ${
              selectedProject === project.id
                ? "bg-gray-50"
                : "hover:bg-gray-100"
            }`}
          >
            <img
              src={`https://api.dicebear.com/9.x/glass/svg?seed=${project.name}`}
              alt={project.name}
              className="w-10 h-10 rounded-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className={`text-sm flex items-center gap-2 ${
                selectedProject === project.id ? "font-bold text-gray-900" : "font-medium text-gray-700"
              }`}>
                {selectedProject === project.id && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" style={{ backgroundColor: "#14746f" }}></span>
                )}
                {project.name}
              </div>
              <div className="text-xs truncate mt-0.5 text-gray-500">
                {project.path}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
