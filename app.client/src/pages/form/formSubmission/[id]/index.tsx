"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import React from "react";
import Text from "@/components/Text";
import AgGrid from "@/components/AgGrid";
import ButtonToHome from "@/components/ButtonToHome";
import ListButton from "@/components/ListButton";

type Props = {
  params: {
    id: string;
  };
};

const GridExample: React.FC<Props> = ({ params }) => {
  const { id } = params;

  // Simulate fetched submissions
  const submissions = [
    {
      id: "1",
      createdAt: Date.now(),
      jsonData: JSON.stringify([
        { field: "Name", value: "Alice" },
        { field: "Email", value: "alice@example.com" },
      ]),
    },
    {
      id: "2",
      createdAt: Date.now(),
      jsonData: JSON.stringify([
        { field: "Name", value: "Bob" },
        { field: "Email", value: "bob@example.com" },
      ]),
    },
  ];

  // Parse submission JSON
  const parsedData = submissions.map((entry: any) => ({
    ...entry,
    jsonData: JSON.parse(entry.jsonData),
  }));

  const csvArray = parsedData.flatMap((entry: any) => entry.jsonData);

  return (
    <>
      <ButtonToHome />
      {submissions.length ? (
        <>
          <ListButton csvArray={csvArray} />
          <AgGrid
            parsedData={parsedData}
            subData={submissions}
            csvArray={csvArray}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Text component="h1" variant="subtitle1">
            No submissions to preview
          </Text>
        </div>
      )}
    </>
  );
};

export default GridExample;
