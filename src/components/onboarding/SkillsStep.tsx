'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QUICK_ADD_SKILLS } from '@/types/onboarding';

interface SkillsStepProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsStep({ skills, onChange }: SkillsStepProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !skills.includes(trimmedValue)) {
      onChange([...skills, trimmedValue]);
      setInputValue('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleQuickAdd = (skill: string) => {
    if (!skills.includes(skill)) {
      onChange([...skills, skill]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">What are your main skills?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Add technologies, services, and expertise your company offers.
        </p>
      </div>

      <div className="space-y-6">
        {/* Add Skills Input */}
        <div className="space-y-2">
          <label htmlFor="skillInput" className="text-sm font-medium text-gray-900">
            Add Skills
          </label>
          <div className="flex gap-2">
            <Input
              id="skillInput"
              placeholder="e.g., React, Node.js, Mobile Development"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-11 flex-1"
            />
            <Button
              onClick={handleAddSkill}
              className="h-11 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Your Skills */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Your Skills ({skills.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="h-8 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 text-sm font-normal"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Add */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">
            Quick Add (Click to add)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {QUICK_ADD_SKILLS.map((skill) => (
              <Button
                key={skill}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(skill)}
                disabled={skills.includes(skill)}
                className="h-9 justify-start text-sm font-normal"
              >
                <Plus className="mr-1 h-3 w-3" />
                {skill}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
