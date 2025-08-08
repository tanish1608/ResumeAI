interface ProfessionalSummaryEditorProps {
  summary: string;
  onChange: (summary: string) => void;
}

export function ProfessionalSummaryEditor({ summary, onChange }: ProfessionalSummaryEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={6}
          placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives..."
        />
        <p className="text-xs text-gray-500 mt-2">
          Tip: Keep it concise (2-4 sentences) and focus on your most relevant skills and achievements for the target role.
        </p>
        <div className="text-xs text-gray-400 mt-1">
          Character count: {summary.length}
        </div>
      </div>
    </div>
  );
}
