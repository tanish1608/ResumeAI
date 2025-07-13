import React from 'react';
import { Plus, Trash2, Minus } from 'lucide-react';
import { Experience } from '../types/Resume';

interface ExperienceEditorProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experience,
  onChange
}) => {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    };
    onChange([...experience, newExperience]);
  };

  const removeExperience = (id: string) => {
    onChange(experience.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(experience.map(exp => {
      if (exp.id === id) {
        // Create a deep copy to avoid reference sharing
        if (field === 'description' && Array.isArray(value)) {
          return { ...exp, [field]: [...value] };
        }
        return { ...exp, [field]: value };
      }
      return exp;
    }));
  };

  const addDescription = (id: string) => {
    const exp = experience.find(e => e.id === id);
    if (exp) {
      // Create a completely new array to avoid reference sharing
      const newDescription = [...exp.description, ''];
      updateExperience(id, 'description', newDescription);
    }
  };

  const removeDescription = (id: string, index: number) => {
    const exp = experience.find(e => e.id === id);
    if (exp && exp.description.length > 1) {
      // Create a new array without the specified index
      const newDescription = exp.description.filter((_, i) => i !== index);
      updateExperience(id, 'description', newDescription);
    }
  };

  const updateDescription = (id: string, index: number, value: string) => {
    const exp = experience.find(e => e.id === id);
    if (exp) {
      // Create a completely new array with the updated value
      const newDescription = exp.description.map((desc, i) => 
        i === index ? value : desc
      );
      updateExperience(id, 'description', newDescription);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {experience.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-600">Experience Entry</h4>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="January 2023"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Currently working here
              </label>
            </div>

            {!exp.current && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="December 2023"
                  maxLength={100}
                  // maxLength={200}
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <button
                onClick={() => addDescription(exp.id)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Point</span>
              </button>
            </div>
            {(exp.description || []).map((desc, index) => (
              <div key={`${exp.id}-desc-${index}`} className="flex items-start space-x-2 mb-2">
                <textarea
                  value={desc || ''}
                  onChange={(e) => updateDescription(exp.id, index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Describe your responsibilities and achievements..."
                />
                {(exp.description || []).length > 1 && (
                  <button
                    onClick={() => removeDescription(exp.id, index)}
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