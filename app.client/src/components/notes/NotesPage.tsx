import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { NoteService } from "@/api/services/NoteService";
import type { NoteListVM } from "@/api/models/NoteListVM";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Bold, Italic, Underline, Link2, List, ListOrdered, Plus, ChevronDown, AlignLeft, Search, ChevronLeft, Trash2
} from "lucide-react";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';

const CustomLink = LinkExtension.extend({
  inclusive: false,
  exitable: true,
});

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const decodeHtmlEntities = (str: string): string => {
  return str
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
};

const extractTitle = (text?: string | null): string => {
  if (!text) return "New note";
  const strippedText = decodeHtmlEntities(text.replace(/<[^>]+>/g, '')).trim();
  const firstLine = strippedText.split("\n")[0];
  return firstLine || "New note";
};

const extractSnippet = (text?: string | null): string => {
  if (!text) return "No text yet";
  const strippedText = decodeHtmlEntities(text.replace(/<[^>]+>/g, '')).trim();
  const lines = strippedText.split("\n");
  if (lines.length <= 1) return "No text yet";
  return lines.slice(1).join(" ").substring(0, 60);
};

export default function NotesPage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || localStorage.getItem("activeProjectId") || undefined;

  const [notes, setNotes] = useState<NoteListVM[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Keep track of the active note text in local state for fast typing
  const [activeNoteText, setActiveNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Debouncing timeout reference
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await NoteService.getApiVNote("1", "Project", projectId);
      if (res.success && res.data) {
        // Sort notes to show newest at top
        const sortedNotes = res.data.sort((a, b) => {
          const dateA = a.lastModifiedDate || a.createdDate || "";
          const dateB = b.lastModifiedDate || b.createdDate || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        setNotes(sortedNotes);

        // Auto-select first note if none selected AND we are on desktop
        if (!activeNoteId && sortedNotes.length > 0) {
          if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            const firstNote = sortedNotes[0];
            setActiveNoteId(firstNote.noteID || null);
            setActiveNoteText(firstNote.noteText || "");
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch notes", err);
      toast.error("Failed to load notes");
    }
  }, [projectId, activeNoteId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSelectNote = (note: NoteListVM) => {
    setActiveNoteId(note.noteID || null);
    setActiveNoteText(note.noteText || "");
  };

  const handleCreateNote = async () => {
    try {
      setIsSaving(true);
      const res = await NoteService.postApiVNote("1", {
        noteText: "New note\n<p></p>",
        category: "Project",
        categoryID: projectId || null,
        isActive: true,
      });

      if (res.success && res.data) {
        const newNoteItem = res.data as NoteListVM;
        setNotes((prev) => [newNoteItem, ...prev]);
        setActiveNoteId(newNoteItem.noteID || null);
        setActiveNoteText(newNoteItem.noteText || "");
        toast.success("Note created");
      } else {
        toast.error("Failed to create note");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating Note");
    } finally {
      setIsSaving(false);
    }
  };

  const saveNote = async (noteId: string, currentText: string) => {
    setIsSaving(true);
    try {
      const res = await NoteService.putApiVNote("1", {
        noteID: noteId,
        noteText: currentText,
        category: "Project",
        categoryID: projectId || null,
        isActive: true,
      });
      if (res.success) {
        setNotes((prev) =>
          prev.map((n) =>
            n.noteID === noteId ? { ...n, noteText: currentText, lastModifiedDate: new Date().toISOString() } : n
          )
        );
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteToDeleteId(noteId);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!noteToDeleteId) return;
    try {
      await NoteService.deleteNote(noteToDeleteId, "1");
      setNotes((prev) => prev.filter((n) => n.noteID !== noteToDeleteId));
      if (activeNoteId === noteToDeleteId) {
        setActiveNoteId(null);
        setActiveNoteText("");
      }
      toast.success("Note deleted");
    } catch (err) {
      toast.error("Failed to delete note");
    } finally {
      setNoteToDeleteId(null);
      setIsConfirmDeleteDialogOpen(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Parse Title / Body safely
  // ---------------------------------------------------------------------------
  const firstNewlineIndex = activeNoteText.indexOf("\n");
  let titleValue = activeNoteText;
  let bodyValue = "";
  if (firstNewlineIndex !== -1) {
    titleValue = activeNoteText.substring(0, firstNewlineIndex);
    bodyValue = activeNoteText.substring(firstNewlineIndex + 1);
  }

  // ---------------------------------------------------------------------------
  // TipTap Rich Text Editor Configuration
  // ---------------------------------------------------------------------------
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      CustomLink.configure({ openOnClick: false, autolink: false }),
    ],
    content: bodyValue,
    onUpdate: ({ editor }) => {
      const newBody = editor.getHTML();
      const newFullText = titleValue + "\n" + newBody;

      setActiveNoteText(newFullText);
      setNotes((prev) => prev.map((n) => n.noteID === activeNoteId ? { ...n, noteText: newFullText } : n));

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (activeNoteId) {
        timeoutRef.current = setTimeout(() => saveNote(activeNoteId, newFullText), 800);
      }
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px] text-foreground text-base [&_p]:mb-2 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_a]:text-blue-500 [&_a]:underline',
      },
    },
  });

  // Sync editor content only when active note changes
  useEffect(() => {
    if (editor && activeNoteId) {
      editor.commands.setContent(bodyValue, false);
    }
  }, [activeNoteId]); // Intentionally omitting editor/bodyValue so it only syncs on note switch

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const newFullText = newTitle + "\n" + bodyValue;

    setActiveNoteText(newFullText);
    setNotes((prev) => prev.map((n) => n.noteID === activeNoteId ? { ...n, noteText: newFullText } : n));

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (activeNoteId) {
      timeoutRef.current = setTimeout(() => saveNote(activeNoteId, newFullText), 800);
    }
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const activeBtnClass = (name: string, attrs?: any) =>
    editor?.isActive(name, attrs) ? "bg-muted dark:bg-zinc-800 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-zinc-800/50";

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const text = (note.noteText || "").toLowerCase();
    return text.includes(query);
  });

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-background">

      {/* Left Sidebar (Notes List) - Hidden on mobile if a note is active */}
      <div className={`w-full md:w-80 border-r border-border dark:border-[#2a2a2a] bg-muted/20 flex-col h-full shrink-0 ${activeNoteId ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-border dark:border-[#2a2a2a] gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted border border-border dark:border-[#2a2a2a] rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={handleCreateNote}
            className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors shrink-0"
            title="Create New Note"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => {
            const isActive = note.noteID === activeNoteId;
            return (
              <div
                key={note.noteID}
                onClick={() => handleSelectNote(note)}
                className={`group flex flex-col p-4 cursor-pointer border-b border-border dark:border-[#2a2a2a] transition-colors relative 
                  ${isActive ? "bg-muted/60 dark:bg-zinc-800/80" : "hover:bg-muted/40 dark:hover:bg-zinc-900"}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-foreground dark:text-white' : 'text-foreground/90'} flex-1`}>
                    {extractTitle(note.noteText)}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      note.noteID && handleDelete(note.noteID, e);
                    }}
                    className=" group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-500 rounded transition-all shrink-0 focus:opacity-100"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate pr-6">
                  {extractSnippet(note.noteText)}
                </p>
                <span className="text-[10px] text-muted-foreground/70 mt-2 font-medium">
                  {note.createdDate ? format(new Date(note.createdDate), "MMM dd, yyyy") : "Today"}
                </span>
              </div>
            );
          })}
          {filteredNotes.length === 0 && (
            <div className="text-center p-6 text-sm text-muted-foreground">
              {searchQuery.trim() ? "No notes found matching your search." : "No notes yet for this project."}
            </div>
          )}
        </div>
      </div>

      {/* Main Editor Content - Hidden on mobile if NO note is active */}
      <div className={`flex-1 flex-col h-full bg-background relative overflow-hidden ${!activeNoteId ? 'hidden md:flex' : 'flex'}`}>

        {/* Editor Toolbar Header */}
        <div className="flex items-center gap-1.5 px-3 md:px-6 py-3 border-b border-border dark:border-[#2a2a2a] bg-muted/10 shrink-0 overflow-x-auto scrollbar-hide">

          {/* Mobile Back Button */}
          <button
            onClick={() => setActiveNoteId(null)}
            className="md:hidden mr-1 p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-muted dark:hover:bg-zinc-800 transition-colors shrink-0"
            title="Back to notes list"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded hover:bg-muted dark:hover:bg-zinc-800 text-foreground transition-colors outline-none shrink-0"
              >
                {editor?.isActive('heading', { level: 1 }) ? "Heading 1" :
                  editor?.isActive('heading', { level: 2 }) ? "Heading 2" :
                    editor?.isActive('heading', { level: 3 }) ? "Heading 3" :
                      "Normal text"} <ChevronDown className="w-3 h-3 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
              <DropdownMenuItem
                onClick={() => { editor?.chain().focus().setParagraph().run(); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${editor?.isActive('paragraph') ? 'bg-muted font-medium text-primary' : 'hover:bg-muted text-foreground'}`}
              >
                Normal Text
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { editor?.chain().focus().toggleHeading({ level: 1 }).run(); }}
                className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${editor?.isActive('heading', { level: 1 }) ? 'bg-muted text-primary' : 'hover:bg-muted text-foreground'}`}
              >
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { editor?.chain().focus().toggleHeading({ level: 2 }).run(); }}
                className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${editor?.isActive('heading', { level: 2 }) ? 'bg-muted text-primary' : 'hover:bg-muted text-foreground'}`}
              >
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { editor?.chain().focus().toggleHeading({ level: 3 }).run(); }}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${editor?.isActive('heading', { level: 3 }) ? 'bg-muted text-primary' : 'hover:bg-muted text-foreground'}`}
              >
                Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-4 bg-border dark:bg-[#3a3a3a] mx-1 shrink-0" />

          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded transition-colors shrink-0 ${activeBtnClass('bold')}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded transition-colors shrink-0 ${activeBtnClass('italic')}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded transition-colors shrink-0 ${activeBtnClass('underline')}`}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-border dark:bg-[#3a3a3a] mx-1 shrink-0" />

          <button
            onClick={setLink}
            className={`p-1.5 rounded transition-colors shrink-0 ${activeBtnClass('link')}`}
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded transition-colors shrink-0 ${activeBtnClass('bulletList')}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded transition-colors shrink-0 ${activeBtnClass('orderedList')}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-[20px]" />

          {activeNoteId && (
            <button
              onClick={(e) => handleDelete(activeNoteId, e)}
              className="p-1.5 text-muted-foreground hover:text-red-500 rounded hover:bg-muted dark:hover:bg-zinc-800 transition-colors shrink-0"
              title="Delete Note"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleCreateNote}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-muted dark:hover:bg-zinc-800 transition-colors shrink-0 hidden md:flex"
            title="Create New Note"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Editor Body */}
        {activeNoteId ? (() => {
          const activeNote = notes.find((n) => n.noteID === activeNoteId);
          return (
            <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto w-full max-w-4xl mx-auto animate-in fade-in duration-200">
              <input
                type="text"
                placeholder="Title"
                value={titleValue}
                onChange={handleTitleChange}
                className="text-3xl md:text-4xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 w-full mb-2 py-2"
              />

              {activeNote && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground/50 border-b border-border/40 pb-4 mb-6 select-none font-medium">
                  {activeNote.createdDate && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-muted-foreground/70">Created:</span>
                      <span>{format(new Date(activeNote.createdDate), "MMM dd, yyyy 'at' hh:mm a")}</span>
                    </div>
                  )}
                  {activeNote.lastModifiedDate && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-muted-foreground/70">Last Modified:</span>
                      <span>{format(new Date(activeNote.lastModifiedDate), "MMM dd, yyyy 'at' hh:mm a")}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Real WYSIWYG Editor using TipTap */}
              <EditorContent editor={editor} className="flex-1" />

            </div>
          );
        })() : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl cursor-default">📝</span>
            </div>
            <p className="font-medium">No note selected</p>
            <button
              onClick={handleCreateNote}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm transition-colors"
            >
              Create your first note
            </button>
          </div>
        )}
      </div>

      <AlertDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-xl shadow-2xl">
          <AlertDialogHeader className="flex flex-col items-center text-center space-y-4">

            <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground">
              This action cannot be undone. This will permanently delete the
              note and remove its data from our records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-center gap-3 pt-4">
            <AlertDialogCancel className="bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 text-white rounded-lg transition-all duration-200 animate-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
