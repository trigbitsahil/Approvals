"use client";

import { BadgeCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { i18n } from '@lingui/core'

// Simple check to ensure i18n is activated before rendering
const t = (id: string, message: string) => {
  if (!i18n.locale) return message;
  return i18n.t({ id, message });
};

const Inbox = () => {
  return (
    <div className="flex flex-col items-center mt-20 justify-center  gap-2">
      <div className="flex w-full flex-wrap gap-2">
                <Badge>{t("ui.Badge", "Badge")}</Badge>

        <Badge variant="secondary">{t("ui.Secondary", "Secondary")}</Badge>
        <Badge variant="destructive">{t("ui.Destructive", "Destructive")}</Badge>
        <Badge variant="outline">{t("ui.Outline", "Outline")}</Badge>
      </div>
      <div className="flex w-full flex-wrap gap-2">
        <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600"
        >
          <BadgeCheckIcon />
        {t("ui.Verified", "Verified")}
        </Badge>
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          8
        </Badge>
        <Badge
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
          variant="destructive"
        >
          99
        </Badge>
        <Badge
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
          variant="outline"
        

        >
          20+
        </Badge>
      </div>
    </div>
  )
}
export default Inbox;