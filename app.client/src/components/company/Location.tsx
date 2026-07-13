"use client";

import * as React from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Country, State } from "./types"; // Import types

interface LocationComboboxProps {
  value: string;
  onChange: (val: string) => void;
  items: (Country | State)[]; // Can accept either Country or State items
  placeholder?: string;
  searchPlaceholder?: string;
  icon?: React.ElementType;
}

export function LocationCombobox({
  value,
  onChange,
  items,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  icon: Icon = MapPin,
}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState(items);

  React.useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const selectedItem = items.find((item) => item.id === value);

  const handleSearch = (search: string) => {
    const lowerCaseSearch = search.toLowerCase();
    setFilteredItems(
      items.filter((item) => item.name.toLowerCase().includes(lowerCaseSearch))
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 bg-background px-4 py-2 rounded-lg border border-input text-left shadow-sm transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">
              {selectedItem ? selectedItem.name : placeholder}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-lg shadow-lg"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9 px-4 py-2"
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onChange(item.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.id
                        ? "opacity-100 text-primary"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
