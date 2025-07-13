import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Skill } from '../types/Resume';

interface SkillsEditorProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  skills,
  onChange
}) => {
  const addSkillCategory = () => {
    const newSkill: Skill = {
      category: '',
      items: ['']
    };
    onChange([...skills, newSkill]);
  };

  const removeSkillCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const updateSkillCategory = (index: number, category: string) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], category };
    onChange(newSkills);
  };

  const updateSkillItems = (index: number, items: string) => {
    const newSkills = [...skills];
    newSkills[index] = { 
      ...newSkills[index], 
      items: items.split(',').map(item => item.trim()).filter(item => item)
    };
    onChange(newSkills);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
        <button
          onClick={addSkillCategory}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {skills.map((skill, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-600">Skill Category</h4>
            <button
              onClick={() => removeSkillCategory(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={skill.category}
              onChange={(e) => updateSkillCategory(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Programming Languages"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated)
            </label>
            <textarea
              value={(skill.items || []).join(', ')}
              onChange={(e) => updateSkillItems(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Python, JavaScript, Java, C++"
              maxLength={500}
            />
          </div>
        </div>
      ))}
    </div>
  );
};