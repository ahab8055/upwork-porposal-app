'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useCompleteOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { CompanyInfoStep } from '@/components/onboarding/CompanyInfoStep';
import { SkillsStep } from '@/components/onboarding/SkillsStep';
import { TeamInviteStep } from '@/components/onboarding/TeamInviteStep';
import { KnowledgeBaseUploadStep } from '@/components/onboarding/KnowledgeBaseUploadStep';
import { OnboardingData } from '@/types/onboarding';

const TOTAL_STEPS = 5;
const STEPS_CONFIG = [
  { step: 1, label: 'Welcome', progress: 20 },
  { step: 2, label: 'Company Info', progress: 40 },
  { step: 3, label: 'Skills', progress: 60 },
  { step: 4, label: 'Team', progress: 80 },
  { step: 5, label: 'Knowledge Base', progress: 100 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const completeOnboardingMutation = useCompleteOnboarding();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    companyInfo: {
      name: '',
      logo: null,
      industry: '',
      companySize: '',
    },
    skills: [],
    teamMembers: [],
    knowledgeBaseFiles: [],
  });

  // Auth check - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Onboarding check - redirect to dashboard if already onboarded
  useEffect(() => {
    if (user?.onboarding_completed) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const currentStep = STEPS_CONFIG[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < STEPS_CONFIG.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Final step - complete onboarding
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleComplete = () => {
    completeOnboardingMutation.mutate({
      company_name: onboardingData.companyInfo.name,
      industry: onboardingData.companyInfo.industry || undefined,
      company_size: onboardingData.companyInfo.companySize || undefined,
      skills: onboardingData.skills,
      team_invites: onboardingData.teamMembers.map((member) => ({
        full_name: member.fullName,
        email: member.email,
      })),
      knowledge_base_files: onboardingData.knowledgeBaseFiles,
    });
  };

  const canProceed = () => {
    switch (currentStepIndex) {
      case 0: // Welcome
        return true;
      case 1: // Company Info
        return onboardingData.companyInfo.name.trim().length > 0;
      case 2: // Skills
        return true; // Optional step
      case 3: // Team
        return true; // Optional step
      case 4: // Knowledge Base
        return true; // Optional step
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ProposalIQ</h1>
          </div>

          {/* Progress */}
          <div className="mx-auto max-w-2xl">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
              <span>Step {currentStep.step} of {TOTAL_STEPS}</span>
              <span>{currentStep.progress}% Complete</span>
            </div>
            <Progress value={currentStep.progress} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            {/* Step Content */}
            <div className="mb-8">
              {currentStepIndex === 0 && <WelcomeStep />}
              {currentStepIndex === 1 && (
                <CompanyInfoStep
                  data={onboardingData.companyInfo}
                  onChange={(companyInfo) =>
                    setOnboardingData({ ...onboardingData, companyInfo })
                  }
                />
              )}
              {currentStepIndex === 2 && (
                <SkillsStep
                  skills={onboardingData.skills}
                  onChange={(skills) =>
                    setOnboardingData({ ...onboardingData, skills })
                  }
                />
              )}
              {currentStepIndex === 3 && (
                <TeamInviteStep
                  teamMembers={onboardingData.teamMembers}
                  onChange={(teamMembers) =>
                    setOnboardingData({ ...onboardingData, teamMembers })
                  }
                />
              )}
              {currentStepIndex === 4 && (
                <KnowledgeBaseUploadStep
                  files={onboardingData.knowledgeBaseFiles}
                  onChange={(knowledgeBaseFiles) =>
                    setOnboardingData({ ...onboardingData, knowledgeBaseFiles })
                  }
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className="text-gray-600"
              >
                Back
              </Button>

              <div className="flex gap-3">
                {currentStepIndex > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-gray-600"
                  >
                    Skip
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || completeOnboardingMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {completeOnboardingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : currentStepIndex === STEPS_CONFIG.length - 1 ? (
                    'Complete Setup'
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
