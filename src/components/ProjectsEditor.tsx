import React from 'react';
import { Plus, Trash2, Minus } from 'lucide-react';
import { Project } from '../types/Resume';

interface ProjectsEditorProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({
  projects,
  onChange
}) => {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      technologies: '',
      date: '',
      description: [''],
      link: ''
    };
    onChange([...projects, newProject]);
  };

  const removeProject = (id: string) => {
    onChange(projects.filter(proj => proj.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const addDescription = (id: string) => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      updateProject(id, 'description', [...proj.description, '']);
    }
  };

  const removeDescription = (id: string, index: number) => {
    const proj = projects.find(p => p.id === id);
    if (proj && proj.description.length > 1) {
      const newDescription = proj.description.filter((_, i) => i !== index);
      updateProject(id, 'description', newDescription);
    }
  };

  const updateDescription = (id: string, index: number, value: string) => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      const newDescription = [...proj.description];
      newDescription[index] = value;
      updateProject(id, 'description', newDescription);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
        <button
          onClick={addProject}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {projects.map((proj) => (
        <div key={proj.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-600">Project Entry</h4>
            <button
              onClick={() => removeProject(proj.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={proj.title}
                onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="E-commerce Web Application"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies
              </label>
              <input
                type="text"
                value={proj.technologies}
                onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="text"
                value={proj.date}
                onChange={(e) => updateProject(proj.id, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Fall 2023"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link (optional)
              </label>
              <input
                type="text"
                value={proj.link || ''}
                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="github.com/username/project"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <button
                onClick={() => addDescription(proj.id)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Point</span>
              </button>
            </div>
            {proj.description.map((desc, index) => (
              <div key={index} className="flex items-start space-x-2 mb-2">
                <textarea
                  value={desc}
                  onChange={(e) => updateDescription(proj.id, index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Describe your project features and achievements..."
                  maxLength={200}
                  // maxLength={300}
                />
                {proj.description.length > 1 && (
                  <button
                    onClick={() => removeDescription(proj.id, index)}
                    className="text-red-500 hover:text-red-700 transition-colors mt-2"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};