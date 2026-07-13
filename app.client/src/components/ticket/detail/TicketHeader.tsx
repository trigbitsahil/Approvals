import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

interface TicketHeaderProps {
    title: string;
    onUpdateTitle: (newTitle: string) => Promise<void>;
    isEditable?: boolean;
    ticketNo?: string;
}

export const TicketHeader = ({
    title,
    onUpdateTitle,
    isEditable = true,
    ticketNo,
}: TicketHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditedTitle(title);
    }, [title]);

    const handleSave = async () => {
        if (editedTitle.trim() === title) {
            setIsEditing(false);
            return;
        }
        await onUpdateTitle(editedTitle);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            setEditedTitle(title);
            setIsEditing(false);
        }
    };

    return (
        <div className="border-b pb-6">
            {ticketNo && (
                <div className="mb-2">
                    <span className="text-xs font-mono bg-muted border border-border px-2 py-0.5 rounded text-muted-foreground">
                        {ticketNo}
                    </span>
                </div>
            )}
            <div className="group flex items-center gap-3">
                {isEditing ? (
                    <Input
                        ref={titleInputRef}
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="text-3xl font-bold h-14 border-2 border-blue-500"
                        placeholder="Enter title..."
                        autoFocus
                    />
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-foreground">
                            {title || "Untitled Ticket"}
                        </h1>
                        {isEditable && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="h-5 w-5" />
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
