'use client';

import { Zap, Briefcase, Upload, Users } from 'lucide-react';

export function WelcomeStep() {
  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <Zap className="h-10 w-10 text-blue-600" />
        </div>
      </div>

      {/* Title */}
      <h2 className="mb-3 text-2xl font-semibold text-gray-900">
        Welcome to ProposalIQ!
      </h2>

      {/* Description */}
      <p className="mb-10 text-gray-600">
        Let&apos;s set up your workspace in just a few minutes. We&apos;ll help you get started by learning about your company and team.
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Company Info */}
        <div className="rounded-xl bg-blue-50 p-6 text-center transition-all hover:bg-blue-100">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">Company Info</h3>
          <p className="text-sm text-gray-600">
            Add your company details and branding
          </p>
        </div>

        {/* Upload Knowledge */}
        <div className="rounded-xl bg-purple-50 p-6 text-center transition-all hover:bg-purple-100">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">Upload Knowledge</h3>
          <p className="text-sm text-gray-600">
            Share your past projects and expertise
          </p>
        </div>

        {/* Invite Team */}
        <div className="rounded-xl bg-green-50 p-6 text-center transition-all hover:bg-green-100">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">Invite Team</h3>
          <p className="text-sm text-gray-600">
            Collaborate with your team members
          </p>
        </div>
      </div>

      {/* Time estimate */}
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>This will take approximately 5 minutes</span>
      </div>
    </div>
  );
}
