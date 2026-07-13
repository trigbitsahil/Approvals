"use client";

import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import React, { useMemo, useState } from "react";
import type { ColDef } from "@ag-grid-community/core";
import "./style.css";

export type AgGridProps = {
  parsedData: any;
  subData: any;
  csvArray: any;
};

const AgGrid: React.FC<AgGridProps> = ({ parsedData, subData, csvArray }) => {
  const col = Object.keys(parsedData[0].jsonData[0]).map((key) => {
    return {
      field: key,
      cellRenderer: RenderCellContent,
    };
  });

  const row = parsedData.map((row: any) => row.jsonData[0]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>(col);

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      wrapText: true,
    };
  }, []);

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact
        rowData={row}
        columnDefs={columnDefs as any}
        defaultColDef={defaultColDef}
        suppressRowClickSelection={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  );
};

export default AgGrid;

// ✅ Replaced MUI Link with native <a> tag
const RenderCellContent = (params: CustomCellRendererProps) => {
  return (
    <>
      {params.value === true ? (
        "true"
      ) : params.value === false ? (
        "false"
      ) : params.value?.toString().includes("/api/s3/form/") ? (
        <a
          href={params.value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View File
        </a>
      ) : (
        params.value
      )}
    </>
  );
};
