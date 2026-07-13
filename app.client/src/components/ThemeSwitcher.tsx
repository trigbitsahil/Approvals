"use client";

import { useEffect, useState } from "react";
import { PaintBucket } from "lucide-react";
import { i18n } from "@lingui/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const themes = ["Blue", "Green", "Neutral", "Rose", "Violet"] as const;
type ColorTheme = (typeof themes)[number];

const themeColors: Record<ColorTheme, string> = {
  Blue: "#3b82f6",
  Green: "#22c55e",
  Neutral: "#71717a",
  Rose: "#f43f5e",
  Violet: "#8b5cf6",
};

const ColorThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem("color-theme") as ColorTheme) || "Rose"; // Changed default from "blue" to "Rose"
  });

  const [tempTheme, setTempTheme] = useState<ColorTheme>(currentTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-color-theme", currentTheme);
    localStorage.setItem("color-theme", currentTheme);
  }, [currentTheme]);

  const handleConfirm = () => {
    setCurrentTheme(tempTheme);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PaintBucket className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {i18n.t({ id: "ui.SelectTheme", message: "Select Your Theme" })}
          </DialogTitle>
          <DialogDescription>
            {i18n.t({
              id: "ui.ChooseThemeDescription",
              message:
                "Choose your preferred theme color to personalize your interface.",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="theme">
            {i18n.t({ id: "ui.AvailableThemes", message: "Available Themes" })}
          </Label>
          <Select
            value={tempTheme}
            onValueChange={(value: ColorTheme) => setTempTheme(value)}
          >
            <SelectTrigger id="theme">
              <SelectValue
                placeholder={i18n.t({
                  id: "ui.SelectThemePlaceholder",
                  message: "Select a theme",
                })}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: themeColors[tempTheme] }}
                  />
                  {tempTheme}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme} value={theme} className="capitalize">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: themeColors[theme] }}
                    />
                    {i18n.t({
                      id: `theme.${theme.toLowerCase()}`,
                      message: theme,
                    })}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {i18n.t({
              id: "ui.ThemeApplyNote",
              message: "This change will immediately apply the selected theme.",
            })}
          </p>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">
              {i18n.t({ id: "ui.Cancel", message: "Cancel" })}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleConfirm}>
              {i18n.t({ id: "ui.Confirm", message: "Confirm" })}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColorThemeSwitcher;