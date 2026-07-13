"use client";

import { useEffect, useState, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";

const CustomLink = LinkExtension.extend({
  inclusive: false,
  exitable: true,
});
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import { Paperclip } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link,
  List,
  ListOrdered,
  Plus,
  Image as ImageIcon,
  Code,
  ChevronDown,
  Calendar,
  Play,
  Pause,
  Flag,
  MoreVertical,
  Trash2,
} from "lucide-react";

const languages = ["javascript", "cpp", "java", "html", "css"];

const lowlight = createLowlight();

lowlight.register("javascript", javascript);
lowlight.register("cpp", cpp);
lowlight.register("java", java);
lowlight.register("html", xml);
lowlight.register("css", css);

export default function Scheduled({
  taskName,
  initialDescription,
  onDescriptionChange,
  onBlur,
  hideScheduleCard = false
}: {
  taskName: string;
  initialDescription?: string;
  onDescriptionChange?: (content: string) => void;
  onBlur?: () => void;
  hideScheduleCard?: boolean;
}) {
  const [textType, setTextType] = useState("Normal text");
  const [showMenu, setShowMenu] = useState(false);
  const [showPlus, setShowPlus] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  /* ---------------- Scheduler States ---------------- */

  const [works, setWorks] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);

  const [time, setTime] = useState("1h");
  const [assignee, setAssignee] = useState(taskName);
  useEffect(() => {
    setAssignee(taskName);
  }, [taskName]);

  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const [showRowCalendar, setShowRowCalendar] = useState<number | null>(null);
  const [showTimeDropdown, setShowTimeDropdown] = useState<number | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [showFileMenu, setShowFileMenu] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;

    if (!uploadedFiles) return;

    const newFiles = Array.from(uploadedFiles);

    setFiles((prev) => [...prev, ...newFiles]);

    e.target.value = "";
  };

  const timeOptions = ["15 min", "30 min", "45 min", "1h", "1:30 hours", "2h"];

  /* ---------------- Timer ---------------- */

  const [runningId, setRunningId] = useState<number | null>(null);

  useEffect(() => {
    if (runningId === null) return;

    const interval = setInterval(() => {
      setWorks((prev) =>
        prev.map((w) =>
          w.id === runningId ? { ...w, seconds: w.seconds + 1 } : w,
        ),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [runningId]);

  const formatTimer = (sec: number) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  /* ---------------- Editor ---------------- */

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Image,
      CustomLink.configure({ openOnClick: false, autolink: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: initialDescription || "<p></p>",
    onUpdate: ({ editor }) => {
      onDescriptionChange?.(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[150px] text-foreground text-sm [&_p]:mb-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_a]:text-blue-500 [&_a]:underline',
      },
    },
  });

  useEffect(() => {
    if (editor && initialDescription !== undefined && editor.getHTML() !== initialDescription) {
      editor.commands.setContent(initialDescription);
    }
  }, [initialDescription, editor]);

  if (!editor) return null;

  const addImage = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = prompt("Enter link", previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  /* ---------------- Save Work ---------------- */

  const saveWork = () => {
    if (!selectedDate) return;

    const newWork = {
      id: Date.now(),
      date: selectedDate,
      planned: time,
      user: assignee,
      seconds: 0,
    };

    setWorks((prev) => [...prev, newWork]); // safer state update

    setSelectedDate(undefined); // reset date
    setTime("1h"); // reset time

    setOpenDialog(false);
  };
  /* ---------------- Delete Work ---------------- */

  const deleteWork = (id: number) => {
    setWorks(works.filter((w) => w.id !== id));
  };

  return (
    <div className="w-full ">
      {/* ================= EDITOR CARD ================= */}

      <div className=" border border-zinc-800 rounded-xl">
        {/* Toolbar (same as your code) */}
        <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 px-4 py-2">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1 text-sm "
            >
              {textType}
              <ChevronDown size={16} />
            </button>

            {showMenu && (
              <div className="absolute top-8 left-0 bg-[#1c1c1c] border border-zinc-700 rounded-md w-40 z-50 overflow-hidden shadow-lg">
                <button
                  onClick={() => { editor?.chain().focus().setParagraph().run(); setTextType("Normal text"); setShowMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${editor?.isActive('paragraph') ? 'bg-zinc-800 text-primary' : 'hover:bg-zinc-700 text-foreground'}`}
                >
                  Normal text
                </button>
                <button
                  onClick={() => { editor?.chain().focus().toggleHeading({ level: 1 }).run(); setTextType("Heading 1"); setShowMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${editor?.isActive('heading', { level: 1 }) ? 'bg-zinc-800 text-primary' : 'hover:bg-zinc-700 text-foreground'}`}
                >
                  Heading 1
                </button>
                <button
                  onClick={() => { editor?.chain().focus().toggleHeading({ level: 2 }).run(); setTextType("Heading 2"); setShowMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-zinc-800 text-primary' : 'hover:bg-zinc-700 text-foreground'}`}
                >
                  Heading 2
                </button>
                <button
                  onClick={() => { editor?.chain().focus().toggleBlockquote().run(); setTextType("Quote"); setShowMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm italic transition-colors ${editor?.isActive('blockquote') ? 'bg-zinc-800 text-primary' : 'hover:bg-zinc-700 text-foreground'}`}
                >
                  Quote
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="p-1 hover:bg-zinc-700 rounded"
          >
            <Bold size={17} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="p-1 hover:bg-zinc-700 rounded"
          >
            <Italic size={17} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className="p-1 hover:bg-zinc-700 rounded"
          >
            <UnderlineIcon size={17} />
          </button>

          <button onClick={addLink} className="p-1 hover:bg-zinc-700 rounded">
            <Link size={17} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className="p-1 hover:bg-zinc-700 rounded"
          >
            <List size={17} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className="p-1 hover:bg-zinc-700 rounded"
          >
            <ListOrdered size={17} />
          </button>

          <div className="relative ml-auto">
            {/* <button
              onClick={() => setShowPlus(!showPlus)}
              className="p-1 rounded hover:bg-blue-700"
            >
              <Plus size={18} />
            </button> */}

            {showPlus && (
              <div className="absolute right-0 top-8 bg-[#1c1c1c] border border-zinc-700 rounded-md w-44 z-50">
                {/* IMAGE */}
                <div
                  onClick={() => {
                    fileRef.current?.click();
                    setShowPlus(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-700 cursor-pointer"
                >
                  <ImageIcon size={16} />
                  Image
                </div>

                {/* CODE BLOCK */}
                <div
                  onClick={() => {
                    editor?.chain().focus().toggleCodeBlock().run();
                    setShowLang(true);
                    setShowPlus(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-700 cursor-pointer"
                >
                  <Code size={16} />
                  Code block
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileRef}
            onChange={addImage}
            className="hidden"
          />
        </div>

        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
      </div>
      {showLang && editor?.isActive("codeBlock") && (
        <div className="mt-2  border border-zinc-700 rounded-md w-40">
          {languages.map((lang) => (
            <div
              key={lang}
              onClick={() => {
                editor.chain().focus().setCodeBlock({ language: lang }).run();
                setShowLang(false);
              }}
              className="px-3 py-2 hover:bg-zinc-700 cursor-pointer text-sm"
            >
              {lang}
            </div>
          ))}
        </div>
      )}

      {!hideScheduleCard && (
        <>
          {/* GAP */}
          <div className="h-6"></div>

          {/* ================= SCHEDULE CARD ================= */}

          <div className=" border-zinc-800 rounded-xl p-4 space-y-4">
            {/* <div className="flex items-center gap-2 text-sm ">
              <Calendar size={16} />
              Scheduled work
              <span className="bg-zinc-700 text-xs px-2 py-0.5 rounded">
                {works.length}
              </span>
            </div> */}

            {/* WORK ROWS */}

            {works.map((w, index) => (
              <div
                key={w.id}
                className="flex items-center justify-between border border-zinc-800 rounded-lg px-4 py-3 relative"
              >
                <div className="flex items-center gap-8 text-sm">
                  {/* DATE */}

                  <div className="relative">
                    <div className="text-zinc-400">Date</div>

                    <div
                      onClick={() =>
                        setShowRowCalendar(showRowCalendar === index ? null : index)
                      }
                      className="cursor-pointer"
                    >
                      {format(w.date, "MMM dd")}
                    </div>

                    {showRowCalendar === index && (
                      <div className="absolute z-50 mt-2 bg-black p-2 rounded">
                        <DayPicker
                          mode="single"
                          selected={w.date}
                          onSelect={(d) => {
                            if (!d) return;

                            setWorks((prev) =>
                              prev.map((item, i) =>
                                i === index ? { ...item, date: d } : item,
                              ),
                            );

                            setShowRowCalendar(null);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* USER */}

                  <div>
                    <div className="text-zinc-400">User</div>

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs">
                        {w.user?.charAt(0)?.toUpperCase()}
                      </div>
                      {w.user}
                    </div>
                  </div>

                  {/* PLANNED TIME */}

                  <div className="relative">
                    <div className="text-zinc-400">Planned</div>

                    <div
                      onClick={() =>
                        setShowTimeDropdown(
                          showTimeDropdown === index ? null : index,
                        )
                      }
                      className="cursor-pointer"
                    >
                      {w.planned}
                    </div>

                    {showTimeDropdown === index && (
                      <div className="absolute mt-2 bg-[#1c1c1c] border border-zinc-700 rounded-md w-36 z-50">
                        {timeOptions.map((t) => (
                          <div
                            key={t}
                            onClick={() => {
                              setWorks((prev) =>
                                prev.map((item, i) =>
                                  i === index ? { ...item, planned: t } : item,
                                ),
                              );

                              setShowTimeDropdown(null);
                            }}
                            className="px-3 py-2 hover:bg-zinc-700 cursor-pointer"
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* TIMER */}

                <div className="flex items-center gap-4 text-zinc-400">
                  <button
                    onClick={() => setRunningId(runningId === w.id ? null : w.id)}
                  >
                    {runningId === w.id ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <span>{formatTimer(w.seconds)}</span>

                  <Flag size={18} />

                  {/* MENU */}

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === w.id ? null : w.id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {menuOpen === w.id && (
                      <div className="absolute right-0 mt-2 bg-[#1c1c1c] border border-zinc-700 rounded-md w-36">
                        <button
                          onClick={() => deleteWork(w.id)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-700 w-full text-red-500"
                        >
                          <Trash2 size={14} />
                          Delete work
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* <button
              onClick={() => setOpenDialog(true)}
              className="text-sm"
            >
              + Schedule more work
            </button> */}
          </div>

          {/* ================= ATTACH FILE (SHOW UNDER SCHEDULER) ================= */}

          {/* ATTACH FILE BUTTON */}
          {/* HIDDEN FILE INPUT */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={handleUpload}
          />

          {/* FILES SECTION */}
          {files.length > 0 && (
            <div className="mt-6">
              {/* HEADER */}
              <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                <Paperclip size={16} />
                Files
                <span className="bg-zinc-800 px-2 py-[2px] rounded text-xs">
                  {files.length}
                </span>
              </div>

              {/* FILE GRID */}
              <div className="flex gap-4 flex-wrap">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="w-[120px] h-[120px] bg-zinc-800 rounded-lg flex flex-col items-center justify-center text-center text-xs relative hover:bg-zinc-700"
                  >
                    {/* PDF ICON */}
                    <div className="text-red-500 text-2xl font-bold mb-2">PDF</div>

                    {/* FILE NAME */}
                    <span className="px-2 truncate w-full text-white">
                      {file.name}
                    </span>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="absolute top-1 right-1 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* ATTACH BUTTON (only when files exist) */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 text-sm text-blue-400 hover:text-blue-300"
              >
                + Attach file
              </button>
            </div>
          )}
          {/* ================= DIALOG ================= */}
          {openDialog && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-[420px] bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold">Schedule more work</h2>

                {/* Date */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Date
                  </label>

                  <div
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="mt-1 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 cursor-pointer"
                  >
                    {selectedDate
                      ? format(selectedDate, "dd-MM-yyyy")
                      : "dd-mm-yyyy"}
                  </div>

                  {showCalendar && (
                    <div className="mt-2 p-2 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => {
                          setSelectedDate(d);
                          setShowCalendar(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Planned Time */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Planned time
                  </label>

                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full mt-1 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-md px-3 py-2"
                  />
                </div>

                {/* Assignee */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Assignee
                  </label>

                  <div className="flex items-center gap-2 mt-1 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-semibold">
                      {taskName.charAt(0).toUpperCase()}
                    </div>

                    <span>{taskName}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => setOpenDialog(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveWork}
                    className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
