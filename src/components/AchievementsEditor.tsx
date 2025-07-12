import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface AchievementsEditorProps {
  achievements: string[];
  onChange: (achievements: string[]) => void;
}

export const AchievementsEditor: React.FC<AchievementsEditorProps> = ({
  achievements,
  onChange
}) => {
  const addAchievement = () => {
    onChange([...achievements, '']);
  };

  const removeAchievement = (index: number) => {
    onChange(achievements.filter((_, i) => i !== index));
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    onChange(newAchievements);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
        <button
          onClick={addAchievement}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {achievements.map((achievement, index) => (
        <div key={index} className="flex items-start space-x-2">
          <textarea
            value={achievement}
            onChange={(e) => updateAchievement(index, e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="Dean's List - Fall 2021, Spring 2022"
          />
          <button
            onClick={() => removeAchievement(index)}
            className="text-red-500 hover:text-red-700 transition-colors mt-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};