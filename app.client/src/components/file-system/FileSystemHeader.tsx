import { Search, Filter, Star, Calendar, Check, PlusCircle, X, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/utils/cn";
import type { FileSystemFilters, TagVM } from "./types";
import { DOCUMENT_TYPE_OPTIONS } from "./types";

interface FileSystemHeaderProps {
  category: string;
  categoryId: string;
  filters: FileSystemFilters;
  availableTags: TagVM[];
  onFilterChange: (filters: FileSystemFilters) => void;
  onApplyFilter: () => void;
  onClearFilters: () => void;
  isLoading: boolean;
  documentCount: number;
  className?: string;
}

export function FileSystemHeader({
  category,
  categoryId,
  filters,
  availableTags,
  onFilterChange,
  onApplyFilter,
  onClearFilters,
  isLoading,
  documentCount,
  className,
}: FileSystemHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const docTypeOptions = DOCUMENT_TYPE_OPTIONS[category] ?? [];

  const set = (partial: Partial<FileSystemFilters>) =>
    onFilterChange({ ...filters, ...partial });

  return (
    <div className={cn("border-b bg-card px-4 py-3 space-y-3", className)}>
      {/* Title row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => navigate(`/documents?projectId=${categoryId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-sm sm:text-base font-bold truncate text-slate-900 dark:text-slate-100">
              {category ? `${category} — File View` : "File System"}
            </h1>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap">
            ({documentCount} documents)
          </span>
        </div>

        {/* Mobile Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          className="flex sm:hidden h-8 px-2.5 shrink-0 gap-1.5 font-bold border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 rounded-lg transition-all active:scale-95"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="text-xs">{isExpanded ? "Hide" : "Filters"}</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Filter row - Responsive Grid (Hidden on mobile unless expanded) */}
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 items-end",
        !isExpanded && "hidden sm:grid"
      )}>
        {/* Search */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <Label className="text-xs">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="pl-7 h-8 text-sm"
              placeholder="Search..."
              value={filters.searchText}
              onChange={(e) => set({ searchText: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onApplyFilter()}
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Start Date
          </Label>
          <Input
            type="date"
            className="h-8 text-sm w-36"
            value={filters.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs flex items-center gap-1">
            <Calendar className="h-3 w-3" /> End Date
          </Label>
          <Input
            type="date"
            className="h-8 text-sm w-36"
            value={filters.endDate}
            onChange={(e) => set({ endDate: e.target.value })}
          />
        </div>

        {/* Document Type */}
        {docTypeOptions.length > 0 && (
          <div className="flex flex-col gap-1 min-w-[180px]">
            <Label className="text-xs">Document Type</Label>
            <Select
              value={filters.documentType || "__all__"}
              onValueChange={(v) =>
                set({ documentType: v === "__all__" ? "" : v })
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Types</SelectItem>
                {docTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tags Multi-Select */}
        <div className="flex flex-col gap-1 min-w-[200px]">
          <Label className="text-xs">Tags</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 justify-start text-left font-normal border-dashed"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {filters.tags.length > 0 ? (
                  <div className="flex gap-1 overflow-hidden">
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {filters.tags.length} selected
                    </Badge>
                  </div>
                ) : (
                  <span className="text-muted-foreground">All Tags</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {availableTags.map((tag) => {
                      const isSelected = filters.tags.includes(tag.tagId || "");
                      return (
                        <CommandItem
                          key={tag.tagId}
                          onSelect={() => {
                            const newTags = isSelected
                              ? filters.tags.filter((id) => id !== tag.tagId)
                              : [...filters.tags, tag.tagId || ""];
                            set({ tags: newTags });
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className={cn("h-4 w-4")} />
                          </div>
                          <span>{tag.name}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  {filters.tags.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => set({ tags: [] })}
                          className="justify-center text-center"
                        >
                          Clear filters
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Starred */}
        <div className="flex items-center gap-2 self-end pb-1">
          <Checkbox
            id="isStared"
            checked={filters.isStared}
            onCheckedChange={(v) => set({ isStared: !!v })}
          />
          <Label htmlFor="isStared" className="text-xs flex items-center gap-1 cursor-pointer">
            <Star className="h-3 w-3 text-amber-400" /> Starred only
          </Label>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 self-end sm:col-span-2 lg:col-span-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 sm:flex-none h-8 text-muted-foreground hover:text-foreground"
            onClick={onClearFilters}
            disabled={isLoading}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
          <Button
            size="sm"
            className="flex-1 sm:flex-none h-8"
            onClick={onApplyFilter}
            disabled={isLoading}
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            {isLoading ? "Loading…" : "Filter"}
          </Button>
        </div>
      </div>
    </div>
  );
}
