"use client";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  variant: "blue" | "green" | "red" | "yellow";
  icon?: React.ReactNode;
}

const variantStyles = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    iconBg: "bg-red-100",
  },
  yellow: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    iconBg: "bg-amber-100",
  },
};

export function StatsCard({ title, value, subtitle, variant, icon }: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all hover:shadow-md",
        styles.bg
      )}
      data-testid={`stats-card-${title.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-medium", styles.text)}>{title}</p>
          <p className={cn("text-3xl font-bold mt-2", styles.text)}>{value}</p>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        {icon && (
          <div className={cn("p-3 rounded-lg", styles.iconBg)}>
            <div className={styles.text}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}
