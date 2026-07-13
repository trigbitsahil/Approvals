"use client";

import * as React from "react";
import { i18n } from "@lingui/core";
import {Trans} from '@lingui/react'
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `Data.${a.length - i}`
);

export const ScrollAreaDemo=()=> {
  return (
<ScrollArea className="h-90 w-50 rounded-md border ml-16 mt-20 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 mr-10">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium dark:text-white">
                    {i18n.t({id:"ui.Tags",message:"Tags"})}
          
        </h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm dark:text-gray-300">
              <Trans id={tag}/>
            </div>
            <Separator className="my-2 dark:bg-gray-700" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
