"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Sparkles } from "lucide-react";
import {
  submitJobAnalysisSchema,
  type SubmitJobAnalysisInput,
} from "@/lib/validations/job-analysis";

interface JobAnalysisSubmitFormProps {
  onSubmit: (data: SubmitJobAnalysisInput) => void;
  isSubmitting?: boolean;
  serverErrors?: Partial<Record<keyof SubmitJobAnalysisInput, string>>;
}

export function JobAnalysisSubmitForm({
  onSubmit,
  isSubmitting = false,
  serverErrors,
}: JobAnalysisSubmitFormProps) {
  const form = useForm<SubmitJobAnalysisInput>({
    resolver: zodResolver(submitJobAnalysisSchema),
    defaultValues: {
      job_title: "",
      job_description: "",
    },
    mode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        data-testid="job-analysis-form"
      >
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Senior React Developer"
                  disabled={isSubmitting}
                  data-testid="job-title-input"
                  {...field}
                />
              </FormControl>
              {serverErrors?.job_title && (
                <p className="text-sm font-medium text-red-600">
                  {serverErrors.job_title}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="job_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the full job posting here..."
                  rows={12}
                  disabled={isSubmitting}
                  className="resize-y min-h-[200px]"
                  data-testid="job-description-input"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Minimum 20 characters. Include requirements, scope, and budget if
                available.
              </FormDescription>
              {serverErrors?.job_description && (
                <p className="text-sm font-medium text-red-600">
                  {serverErrors.job_description}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          data-testid="submit-job-analysis-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing opportunity...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze job
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
