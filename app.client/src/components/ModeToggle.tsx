import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/utils/cn";
import { useState, useEffect } from "react";

export const ModeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");

  const handleToggle = () => {
    setIsDark(!isDark);
    toggleTheme();
  };

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative flex items-center w-12 h-6 rounded-full px-0.5 transition-colors",
        "bg-primary text-primary-foreground"
      )}
      aria-label="Toggle theme"
    >
      <div
        className={cn(
          "absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform",
          isDark ? "translate-x-0" : "translate-x-6"
        )}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-purple-600" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-400" />
        )}
      </div>

      <div className="flex justify-between w-full z-10 px-1">
        <Moon className="h-3 w-3 text-white" />
        <Sun className="h-3 w-3 text-white" />
      </div>
    </button>
  );
};

export default ModeToggle;
