'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import skillsData from '@/data/skills.json';

// Flatten all skills from the JSON into a single list
type SkillEntry = { id: string; canonical_name: string; industry_demand?: string };

function getAllSkills(): SkillEntry[] {
  const result: SkillEntry[] = [];
  const categories = (skillsData as { categories: Record<string, { subcategories?: Record<string, { skills?: SkillEntry[] }>; skills?: SkillEntry[] }> }).categories;
  for (const cat of Object.values(categories)) {
    if (cat.subcategories) {
      for (const sub of Object.values(cat.subcategories)) {
        if (sub.skills) result.push(...sub.skills);
      }
    }
    if (cat.skills) result.push(...cat.skills);
  }
  return result;
}

const ALL_SKILLS = getAllSkills();

// Popular suggestions: skills with very_high or high industry demand
const POPULAR_SKILLS = ALL_SKILLS.filter(
  (s) => s.industry_demand === 'very_high' || s.industry_demand === 'high'
).slice(0, 16);

interface SkillsStepProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsStep({ skills, onChange }: SkillsStepProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.trim().length > 0
      ? ALL_SKILLS.filter((s) =>
          s.canonical_name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 20)
      : [];

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setQuery('');
    setOpen(false);
  };

  const removeSkill = (name: string) => {
    onChange(skills.filter((s) => s !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0) {
        addSkill(filtered[0].canonical_name);
      } else if (query.trim()) {
        addSkill(query.trim());
      }
    }
    if (e.key === 'Escape') setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">What are your main skills?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Add technologies, services, and expertise your company offers.
        </p>
      </div>

      <div className="space-y-5">
        {/* Search Input with dropdown */}
        <div className="space-y-2">
          <label htmlFor="skillSearch" className="text-sm font-medium text-gray-900">
            Search & Add Skills
          </label>
          <div ref={containerRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                id="skillSearch"
                type="text"
                autoComplete="off"
                placeholder="Search skills (e.g. React, Python, Docker)…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(e.target.value.trim().length > 0);
                }}
                onFocus={() => query.trim().length > 0 && setOpen(true)}
                onKeyDown={handleKeyDown}
                className="w-full h-11 rounded-md border border-input bg-background pl-10 pr-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            {/* Dropdown results */}
            {open && filtered.length > 0 && (
              <ul className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md max-h-56 overflow-y-auto">
                {filtered.map((skill) => (
                  <li key={skill.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addSkill(skill.canonical_name);
                      }}
                      disabled={skills.includes(skill.canonical_name)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed text-left"
                    >
                      <span>{skill.canonical_name}</span>
                      {skill.industry_demand === 'very_high' && (
                        <span className="text-xs text-emerald-600 font-medium">Popular</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Selected skills */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Your Skills ({skills.length})</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="h-8 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 text-sm font-normal"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Popular Suggestions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">Popular Skills</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.map((skill) => {
              const selected = skills.includes(skill.canonical_name);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => selected ? removeSkill(skill.canonical_name) : addSkill(skill.canonical_name)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors ${
                    selected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {selected ? <X className="h-3 w-3" /> : <span className="text-xs leading-none">+</span>}
                  {skill.canonical_name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
