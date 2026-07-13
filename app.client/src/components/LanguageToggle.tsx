"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { i18n } from "@lingui/core";
import { Globe } from "lucide-react";
import {Trans} from "@lingui/react"
const languages = [
  { code: "en", label: "🇺🇸 English" },
  { code: "hi", label: "🇮🇳 हिंदी" },
  { code: "de", label: "🇩🇪 Deutsch" },
];

export const LanguageDialog=()=> {
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") || "en";
    setSelectedLang(saved);
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("lang", selectedLang);
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span >
            <Globe />
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            🌐{i18n.t({id:"ui.Select Your Language",message:"Select Your Language"})}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center">
            {i18n.t({id:"ui.Choose your preferred language to personalize your experience.",message:"Choose your preferred language to personalize your experience."})}
            
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="block mb-2 font-medium">
            {i18n.t({id:"ui.Available Languages",message:"Available Languages."})}
          </label>
          <Select value={selectedLang} onValueChange={setSelectedLang}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={i18n._("Choose a language")} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground mt-2 text-center">
                      {i18n.t({id:"ui.This change will reload the app to apply the selected language.",message:"This change will reload the app to apply the selected language."})}

          
        </div>

        <DialogFooter className="pt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
             {i18n.t({id:"ui.Cancel" ,message:"Cancel"})}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleConfirm} className="w-full sm:w-auto">
             {i18n.t({id:"ui.Confirm" ,message:"Confirm"})}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LanguageDialog;
