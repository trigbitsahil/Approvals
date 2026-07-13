import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";
import { getFileIcon, getMimeType, getFileExtension } from "@/utils/file-utils"; // Make sure to use @/ if available, or relative.
// TicketDetail used @/utils/file-utils, I will assume it works.
import { formatFileSize } from "../utils/formatters";
import { FilePreviewDialog } from "@/components/FilePreview";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";

interface TicketAttachmentsProps {
    documents: DocumentUrlListVM[];
    onDelete?: (documentId: string, documentName: string) => void;
    canDelete?: boolean;
}

export const TicketAttachments = ({
    documents,
    onDelete,
    canDelete = false, // Default to false if not provided, or handle logic
}: TicketAttachmentsProps) => {
    const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
    const [previewDocument, setPreviewDocument] = useState<DocumentUrlListVM | null>(null);

    const handlePreview = (doc: DocumentUrlListVM) => {
        setPreviewDocument(doc);
        setIsPreviewDialogOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {documents && documents.length > 0 ? (
                        documents.map((doc, index) => {
                            const FileIcon = getFileIcon(doc.name);
                            const fileExtension = getFileExtension(doc.name);
                            const mimeType = getMimeType(doc.name);

                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/10 dark:bg-gray-800 hover:bg-muted/20 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="p-2 bg-blue-100 dark:bg-primary rounded-lg flex-shrink-0">
                                            <FileIcon className="h-5 w-5    " />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {doc.name || `Document ${index + 1}`}
                                            </p>
                                            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground mt-1">
                                                {doc.size && <span>{formatFileSize(doc.size)}</span>}
                                                {doc.size && <span>•</span>}
                                                <span>{mimeType}</span>
                                                <span>•</span>
                                                <span className="bg-muted px-1.5 py-0.5 rounded-md">
                                                    {fileExtension ? `.${fileExtension}` : "Unknown"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 ml-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePreview(doc)}
                                        >
                                            View
                                        </Button>
                                        {onDelete && doc.documentID && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                                                onClick={() => onDelete(doc.documentID!, doc.name || "")}
                                                title="Delete"
                                                disabled={!canDelete}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <p className="text-sm">No documents attached</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <FilePreviewDialog
                open={isPreviewDialogOpen}
                onOpenChange={setIsPreviewDialogOpen}
                document={previewDocument}
            />
        </>
    );
};
