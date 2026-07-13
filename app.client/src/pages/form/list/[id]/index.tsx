"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import ListButton from "@/components/ListButton";
import ButtonToHome from "@/components/ButtonToHome";
import Text from "@/components/Text";
import { Link } from "react-router-dom";

type Props = {
  params: {
    id: string;
  };
};

const renderCellContent = (
  key: string,
  value: string | object | number | boolean
) => {
  if (typeof value === "object" && value !== null) {
    return (
      <div className="space-y-1">
        {Object.entries(value).map(([subKey, subValue]) => (
          <div key={subKey}>
            {subKey}: {String(subValue)}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "boolean") return value.toString();

  // ✅ Use Link for file preview URLs
  if (typeof value === "string" && value.includes("/api/s3/form/")) {
    return (
      <Link
        to={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View File
      </Link>
    );
  }

  return String(value);
};

const ListingTable: React.FC<Props> = ({ params }) => {
  const { id } = params;

  // Mock submission data
  const parsedData = [
    {
      id: "1",
      createdAt: Date.now(),
      jsonData: [
        { Name: "Alice", Email: "alice@example.com" },
        { Name: "Bob", Email: "bob@example.com" },
      ],
    },
  ];

  const csvArray = parsedData.flatMap((m: any) =>
    m.jsonData.map((entry: Record<string, string>) => ({ ...entry }))
  );

  return (
    <>
      <ButtonToHome />
      {parsedData.length ? (
        <div className="space-y-4 p-4">
          <ListButton csvArray={csvArray} />
          <Card className="overflow-auto">
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(parsedData[0].jsonData[0]).map((key) => (
                    <TableCell key={key} className="font-semibold text-sm">
                      {key}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedData.map((row: any, rowIndex: number) =>
                  row.jsonData.map((item: any, itemIndex: number) => (
                    <TableRow key={`${rowIndex}-${itemIndex}`}>
                      {Object.entries(item).map(([key, value], i) => (
                        <TableCell key={i}>
                          {renderCellContent(key, value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Text component="h1" variant="subtitle1">
            No list to preview
          </Text>
        </div>
      )}
    </>
  );
};

export default ListingTable;
