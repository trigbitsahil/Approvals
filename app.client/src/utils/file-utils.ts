import type React from "react";
import { FileText } from "lucide-react";

// Import specific file icons from react-icons/fa
import {
  FaFileWord,
  FaFileAlt,
  FaFileImage,
  FaFileExcel,
  FaFilePowerpoint,
} from "react-icons/fa";
import { TbFileTypeJpg } from "react-icons/tb";
import { PiFilePng } from "react-icons/pi";
import { SiJpeg } from "react-icons/si";
import { PiFilePdf } from "react-icons/pi";

/**
 * Extracts the file extension from a given file name.
 * @param fileName The name of the file.
 * @returns The file extension (e.g., "pdf", "jpg"), or an empty string if no extension is found.
 */
export const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex === -1
    ? ""
    : fileName.substring(lastDotIndex + 1).toLowerCase();
};

/**
 * Returns the appropriate MIME type for a given file name based on its extension.
 * @param fileName The name of the file.
 * @returns The MIME type string, or "application/octet-stream" if unknown.
 */
export const getMimeType = (fileName: string): string => {
  const extension = getFileExtension(fileName);
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
  return mimeTypes[extension] || "application/octet-stream";
};

/**
 * Returns the appropriate React Icon component based on the file name's extension.
 * Prioritizes specific icons from react-icons/fa, falls back to Lucide's FileText.
 * @param fileName The name of the file.
 * @returns A React Icon component.
 */
export const getFileIcon = (fileName: string): React.ComponentType<any> => {
  const extension = getFileExtension(fileName);
  switch (extension) {
    case "pdf":
      return PiFilePdf;
    case "doc":
    case "docx":
      return FaFileWord;
    case "txt":
      return FaFileAlt;
    case "jpg":
      return TbFileTypeJpg;
    case "jpeg":
      return SiJpeg;
    case "png":
      return PiFilePng;
    case "gif":
      return FaFileImage;
    case "xlsx":
    case "xls":
      return FaFileExcel;
    case "ppt":
    case "pptx":
      return FaFilePowerpoint;
    default:
      return FileText;
  }
};
