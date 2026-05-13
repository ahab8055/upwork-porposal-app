"use client";

import { SkillsSelector } from "@/components/skills/SkillsSelector";

interface SkillsStepProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsStep({ skills, onChange }: SkillsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          What are your main skills?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Add technologies, services, and expertise your company offers.
        </p>
      </div>

      <SkillsSelector skills={skills} onChange={onChange} />
    </div>
  );
}
