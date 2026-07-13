// utils/generatePdf.ts
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import type { FormField } from "../components/DynamicForm/types";

export const generateFormPdf = (formName: string, formFields: FormField[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text(formName, 14, 20);

  // Prepare data for the table
  const data = formFields.map((field) => [
    field.label,
    field.type,
    field.required ? "Yes" : "No",
    field.placeholder || "-",
  ]);

  // Add table
  (doc as any)({
    head: [["Field Label", "Type", "Required", "Placeholder"]],
    body: data,
    startY: 30,
    styles: {
      cellPadding: 5,
      fontSize: 10,
      valign: "middle",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
  });

  return doc;
};
