"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  platformFilter: string;
  onPlatformFilterChange: (value: string) => void;
  onExport: () => void;
  isExporting?: boolean;
  platforms?: string[];
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  platformFilter,
  onPlatformFilterChange,
  onExport,
  isExporting = false,
  platforms = [],
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by title or client..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          data-testid="search-input"
        />
      </div>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-40" data-testid="status-filter">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
          <SelectItem value="won">Won</SelectItem>
          <SelectItem value="lost">Lost</SelectItem>
          <SelectItem value="no_response">Pending</SelectItem>
          <SelectItem value="interviewing">Interviewing</SelectItem>
        </SelectContent>
      </Select>

      {/* Platform Filter */}
      <Select value={platformFilter} onValueChange={onPlatformFilterChange}>
        <SelectTrigger className="w-full sm:w-40" data-testid="platform-filter">
          <SelectValue placeholder="All Platforms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          {platforms.map((platform) => (
            <SelectItem key={platform} value={platform}>
              {platform}
            </SelectItem>
          ))}
          {platforms.length === 0 && (
            <>
              <SelectItem value="Upwork">Upwork</SelectItem>
              <SelectItem value="Freelancer">Freelancer</SelectItem>
              <SelectItem value="Fiverr">Fiverr</SelectItem>
              <SelectItem value="Toptal">Toptal</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      {/* Export Button */}
      <Button
        variant="outline"
        onClick={onExport}
        disabled={isExporting}
        data-testid="export-btn"
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? "Exporting..." : "Export"}
      </Button>
    </div>
  );
}
