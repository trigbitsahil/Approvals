import { format } from "date-fns";

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatDate = (dateString: string | null | undefined) => {
    if (!dateString || dateString === "Invalid Date") return "N/A";
    try {
        return format(new Date(dateString), "MMM d, yyyy, h:mm a");
    } catch {
        return "N/A";
    }
};
