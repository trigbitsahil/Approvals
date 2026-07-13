import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    MessageCircle,
    Upload,
    Download,
    X,
    Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFileIcon, getMimeType, getFileExtension } from "@/utils/file-utils";
import { formatFileSize, formatDate } from "../utils/formatters";
import type { TicketCommentWithDocs } from "../types/ticket";
import { FilePreviewDialog } from "@/components/FilePreview";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";

interface TicketCommentsProps {
    comments: TicketCommentWithDocs[];
    onSendMessage: (message: string, files: File[]) => Promise<void>;
    isSending?: boolean;
}

export const TicketComments = ({
    comments,
    onSendMessage,
    isSending = false,
}: TicketCommentsProps) => {
    const [message, setMessage] = useState("");
    const [commentFiles, setCommentFiles] = useState<File[]>([]);
    const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
    const [previewDocument, setPreviewDocument] = useState<DocumentUrlListVM | null>(
        null
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCommentFiles(Array.from(e.target.files));
        }
    };

    const removeCommentDocument = (index: number) => {
        setCommentFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        await onSendMessage(message, commentFiles);
        setMessage("");
        setCommentFiles([]);
    };

    const handlePreview = (doc: any) => {
        setPreviewDocument(doc);
        setIsPreviewDialogOpen(true);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Comments
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="max-h-[300px] overflow-y-auto pr-0 space-y-4">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div
                                key={comment.ticketCommentId}
                                className="flex flex-col p-4 rounded-lg shadow-sm border dark:border-gray-700 dark:bg-black bg-white"
                            >
                                {/* Avatar + Comment */}
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-primary dark:bg-primary rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {comment.createdBy.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-md text-gray-800 dark:text-gray-200 break-words">
                                            {comment.commentText}
                                        </p>

                                        {/* Documents */}
                                        {comment.documents && comment.documents.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {comment.documents.map((doc, docIndex) => {
                                                    const FileIcon = getFileIcon(doc.name);
                                                    const fileExtension = getFileExtension(doc.name);
                                                    const mimeType = getMimeType(doc.name);
                                                    return (
                                                        <div
                                                            key={docIndex}
                                                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <FileIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                                        {doc.name || `Document ${docIndex + 1}`}
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                                        {doc.size && (
                                                                            <span>{formatFileSize(doc.size)}</span>
                                                                        )}
                                                                        {doc.size && <span>•</span>}
                                                                        <span>{mimeType}</span>
                                                                        <span>•</span>
                                                                        <span className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">
                                                                            {fileExtension
                                                                                ? `.${fileExtension}`
                                                                                : "Unknown"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                                onClick={() => handlePreview(doc)}
                                                                title="View"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email + Date BELOW */}
                                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">{comment.createdBy}</span>
                                    <span className="mx-1">•</span>
                                    <span>{formatDate(comment.createdDate)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                            <p className="text-sm">No comments yet.</p>
                        </div>
                    )}
                </div>

                {/* Add New Message Section */}
                <div className="space-y-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <Label
                        htmlFor="new-message"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Add a new message
                    </Label>
                    <Textarea
                        id="new-message"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full resize-none p-3 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />

                    <div className="space-y-2">
                        <Label
                            htmlFor="comment-attachments"
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            <Upload className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            Attach Files (Optional)
                        </Label>
                        <Input
                            id="comment-attachments"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
                        />

                        {commentFiles.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {commentFiles.map((file, index) => {
                                    const FileIcon = getFileIcon(file.name);
                                    const fileExtension = getFileExtension(file.name);
                                    const mimeType = getMimeType(file.name);
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <FileIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                        {file.name}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <span>{formatFileSize(file.size)}</span>
                                                        <span>•</span>
                                                        <span>{mimeType}</span>
                                                        <span>•</span>
                                                        <span className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">
                                                            {fileExtension
                                                                ? `.${fileExtension}`
                                                                : "Unknown"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 ml-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-600 dark:text-gray-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const url = URL.createObjectURL(file);
                                                        const link = document.createElement("a");
                                                        link.href = url;
                                                        link.download = file.name;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                        URL.revokeObjectURL(url);
                                                    }}
                                                    title="Download"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeCommentDocument(index);
                                                    }}
                                                    title="Remove"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center pt-2">
                        <Button
                            onClick={handleSubmit}
                            className="w-[120px] bg-primary dark:bg-primary text-white  cursor-pointer "
                            disabled={isSending}
                        >
                            {isSending ? "Sending..." : "Send Message"}
                        </Button>
                    </div>
                </div>
            </CardContent>

            <FilePreviewDialog
                open={isPreviewDialogOpen}
                onOpenChange={setIsPreviewDialogOpen}
                document={previewDocument}
            />
        </Card>
    );
};
