"use client";

import React from "react";
import exportFromJSON, { type ExportType } from "export-from-json";
import { Button } from "@/components/ui/button"; // Shadcn UI button

const fileName = "data";
const exportType = exportFromJSON.types.csv;

const exportToCsv = (
  data: { [key: string]: any }[],
  fileName?: string,
  exportType?: ExportType
) => {
  exportFromJSON({ data, fileName, exportType });
};

const ListButton: React.FC<{ csvArray: Record<string, any>[] }> = ({
  csvArray,
}) => {
  const handleDownLoadCsv = React.useCallback(() => {
    exportToCsv(csvArray, fileName, exportType);
  }, [csvArray]);

  return (
    <div className="flex justify-end m-4">
      <Button onClick={handleDownLoadCsv}>Download CSV</Button>
    </div>
  );
};

export default ListButton;
