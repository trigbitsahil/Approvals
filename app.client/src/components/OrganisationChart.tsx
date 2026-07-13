"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdPersonSearch, MdZoomIn, MdZoomOut, MdCenterFocusStrong } from "react-icons/md";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/utils/cn";
import { UserService } from "@/api/services/UserService";
import { DocumentsService } from "@/api/services/DocumentsService";
import type { UserListVM } from "@/api/models/UserListVM";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Person {
  id: string;
  userID?: string | null;
  name: string;
  title?: string;
  image?: string;
  level: number;
  parentId?: string;
  email?: string | null;
  children?: Person[];
}

const getFullName = (user: UserListVM): string => {
  const firstName = user.firstName?.trim() || "";
  const lastName = user.lastName?.trim() || "";
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else {
    return user.userName || user.email || "Unknown User";
  }
};

const getInitials = (fullName: string): string => {
  return fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const OrgAvatar = ({
  userId,
  name,
  className,
  fallbackClassName,
  isRoot = false
}: {
  userId?: string | null;
  name: string;
  className?: string;
  fallbackClassName?: string;
  isRoot?: boolean;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!userId) return;
      try {
        const response = await DocumentsService.getApiVDocuments("1", "User", userId);
        if (response?.data && response.data.length > 0) {
          const latestDoc = response.data[response.data.length - 1];
          setImageUrl(latestDoc.url || (latestDoc as any).blobUrl);
        }
      } catch (err) {
        console.error("Failed to fetch avatar", err);
      }
    };
    fetchImage();
  }, [userId]);

  return (
    <Avatar className={className}>
      {imageUrl ? (
        <AvatarImage src={imageUrl} className="rounded-full object-cover" />
      ) : (
        <AvatarFallback className={cn("text-xs font-bold shadow-inner", fallbackClassName)}>
          {getInitials(name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

const PersonCard = ({
  person,
  isHighlighted,
  refEl,
  isRoot = false,
}: {
  person: Person;
  isHighlighted: boolean;
  refEl?: (el: HTMLDivElement | null) => void;
  isRoot?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="focus:outline-none cursor-pointer group"
          >
            <Card
              ref={refEl}
              className={cn(
                "relative border border-slate-700/50 backdrop-blur-md bg-white/5 dark:bg-slate-900/40 rounded-2xl",
                "w-44 sm:w-48 p-4",
                "transition-all duration-500 ease-out",
                "hover:scale-105 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20",
                "group-hover:bg-white/10 dark:group-hover:bg-slate-800/50",
                isRoot && "border-amber-400/50 shadow-lg shadow-amber-500/10",
                isHighlighted && "ring-4 ring-primary/50 scale-110 z-10",
              )}
            >
              {isRoot && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-4 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-lg">
                    Leadership
                  </div>
                </div>
              )}

              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <OrgAvatar
                    userId={person.id}
                    name={person.name}
                    className={cn(
                      "mx-auto p-0.5 transition-transform duration-500 group-hover:rotate-6",
                      isRoot
                        ? "h-14 w-14 ring-2 ring-amber-400/50"
                        : "h-12 w-12 ring-2 ring-primary/30",
                    )}
                    fallbackClassName={isRoot
                      ? "bg-amber-400 text-black"
                      : "bg-primary/20 text-primary dark:text-white"
                    }
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-slate-900 rounded-full shadow-sm" />
                </div>

                <div className="space-y-1">
                  <h4 className={cn(
                    "text-sm font-bold truncate",
                    isRoot ? "text-amber-400" : "text-slate-900 dark:text-white"
                  )}>
                    {person.name}
                  </h4>

                  <p
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider truncate opacity-70",
                      isRoot ? "text-amber-500" : "text-primary dark:text-primary-foreground",
                    )}
                  >
                    {person.title || "Team Member"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="w-72 p-0 overflow-hidden bg-slate-900 border border-white/10 shadow-2xl rounded-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-200"
        >
          <div className="relative h-20 bg-gradient-to-br from-primary/20 to-transparent">
            <div className="absolute inset-0 bg-slate-900/40" />
          </div>
          <div className="p-5 -mt-10 space-y-4 relative">
            <div className="flex items-end gap-4">
              <OrgAvatar
                userId={person.id}
                name={person.name}
                className="h-16 w-16 ring-4 ring-slate-900 shadow-xl"
                fallbackClassName="bg-primary text-white text-lg"
              />
              <div className="pb-1">
                <h4 className="font-bold text-white text-lg leading-tight">
                  {person.name}
                </h4>
                <p className="text-sm text-primary font-medium">
                  {person.title || "Team Member"}
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-3 border-t border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</span>
                <span className="text-sm font-medium text-slate-300 break-all">
                  {person.email ?? "no-email@company.com"}
                </span>
              </div>


            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const TreeNode = ({
  person,
  highlightName,
  refMap,
  isRoot = false
}: {
  person: Person;
  highlightName: string;
  refMap: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  isRoot?: boolean;
}) => {
  const hasChildren = person.children && person.children.length > 0;

  return (
    <div className="flex flex-col items-center relative">
      {/* Connector line from parent */}
      {!isRoot && (
        <div className="w-px h-10 bg-slate-700/50" />
      )}

      <PersonCard
        person={person}
        isHighlighted={highlightName === person.name}
        refEl={(el) => (refMap.current[person.name] = el)}
        isRoot={isRoot}
      />

      {hasChildren && (
        <>
          {/* Vertical line down to children level */}
          <div className="w-px h-10 bg-slate-700/50" />

          <div className="flex gap-12 pt-0 px-6">
            {person.children!.map((child, index) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Piecewise horizontal connector logic */}
                {person.children!.length > 1 && (
                  <div
                    className={cn(
                      "absolute top-0 h-px bg-slate-700/50",
                      index === 0 ? "left-1/2 -right-6" :
                        index === person.children!.length - 1 ? "-left-6 right-1/2" :
                          "-left-6 -right-6"
                    )}
                  />
                )}
                <TreeNode
                  person={child}
                  highlightName={highlightName}
                  refMap={refMap}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const OrgChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const refMap = useRef<Record<string, HTMLDivElement | null>>({});

  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightName, setHighlightName] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [orgData, setOrgData] = useState<Person | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getApiVUser("1");
        const userList: UserListVM[] = response.data || [];

        const CEO_EMAIL = "shahid.hakim@wallop.in";

        const buildHierarchy = (managerEmail: string, level: number): Person[] => {
          return userList
            .filter(
              (user) =>
                user.reportToUser &&
                user.reportToUser.trim().toLowerCase() ===
                managerEmail.trim().toLowerCase(),
            )
            .map((user) => {
              const email = user.email || "";
              const children = buildHierarchy(email, level + 1);
              const anyUser = user as any;
              return {
                id: user.id || user.userID || crypto.randomUUID(),
                userID: user.id,
                name: getFullName(user),
                email: user.email,
                title: anyUser.title || "Team Member",
                level: level,
                children: children.length > 0 ? children : undefined,
              };
            });
        };

        const ceoUser = userList.find(u => u.email?.toLowerCase() === CEO_EMAIL.toLowerCase());
        const anyCeo = ceoUser as any;

        const root: Person = {
          id: ceoUser?.id || "ceo-static",
          name: ceoUser ? getFullName(ceoUser) : "Shahid Hakim",
          title: anyCeo?.title || "Chief Executive Officer",
          email: CEO_EMAIL,
          level: 0,
          children: buildHierarchy(CEO_EMAIL, 1),
        };

        setOrgData(root);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSelect = (name: string) => {
    setSearchTerm(name);
    setHighlightName(name);
    setShowSearch(false);
    const el = refMap.current[name];
    if (el) {
      el.scrollIntoView({ 
        behavior: "smooth", 
        block: "center", 
        inline: "center" 
      });
    }
    setTimeout(() => setHighlightName(""), 4000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    if (containerRef.current) {
      setStartPos({
        x: e.clientX + containerRef.current.scrollLeft,
        y: e.clientY + containerRef.current.scrollTop,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      containerRef.current.scrollLeft = startPos.x - e.clientX;
      containerRef.current.scrollTop = startPos.y - e.clientY;
    },
    [isDragging, startPos],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY * -0.001;
      const newZoom = Math.min(1.5, Math.max(0.2, zoom + delta));
      setZoom(newZoom);
    }
  };

  const resetZoom = () => {
    setZoom(1);
    if (orgData && refMap.current[orgData.name]) {
      refMap.current[orgData.name]!.scrollIntoView({ 
        behavior: "smooth", 
        block: "center", 
        inline: "center" 
      });
    }
  };

  const allEmployees = useMemo(() => {
    const list: Person[] = [];
    const traverse = (p: Person) => {
      list.push(p);
      p.children?.forEach(traverse);
    };
    if (orgData) traverse(orgData);
    return list;
  }, [orgData]);

  return (
    <div className="relative w-full h-[100vh] rounded-3xl overflow-hidden border border-slate-200/20 dark:border-white/5 shadow-2xl">
      {/* Fixed Search and Navigation Controls */}
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-2">
        <div className="p-1.5 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-xl flex flex-col gap-1.5 shadow-2xl">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-all hover:scale-110 active:scale-95"
            title="Zoom In"
          >
            <MdZoomIn size={18} />
          </button>
          <div className="h-px bg-slate-200 dark:bg-white/5 mx-1.5" />
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-all hover:scale-110 active:scale-95"
            title="Zoom Out"
          >
            <MdZoomOut size={18} />
          </button>
          <div className="h-px bg-slate-200 dark:bg-white/5 mx-1.5" />
          <button
            onClick={resetZoom}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-all hover:scale-110 active:scale-95"
            title="Recenter"
          >
            <MdCenterFocusStrong size={18} />
          </button>
        </div>

        <button
          onClick={() => setShowSearch((prev) => !prev)}
          className="p-3 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95"
          title="Search Directory"
        >
          <MdPersonSearch size={18} />
        </button>

        {showSearch && (
          <div className="absolute top-0 right-16 w-72 animate-in slide-in-from-right-4 duration-300">
            <Command className="border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <CommandInput
                placeholder="Find someone..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="h-12 border-none bg-transparent"
              />
              <CommandList className="max-h-72">
                <CommandGroup heading="Verified Personnel" className="p-2">
                  {allEmployees
                    .filter((p) =>
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((person) => (
                      <CommandItem
                        key={person.id}
                        value={person.name}
                        onSelect={() => handleSelect(person.name)}
                        className="rounded-xl px-3 py-3 aria-selected:bg-primary/20 aria-selected:text-slate-900 dark:aria-selected:text-white cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-slate-200 dark:border-white/10">
                            <AvatarFallback className="text-[10px] bg-slate-100 dark:bg-slate-800">
                              {getInitials(person.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{person.name}</span>
                            <span className="text-[10px] opacity-60 uppercase font-black">{person.title}</span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandEmpty className="py-8 text-center text-slate-500 font-medium">No matches found</CommandEmpty>
              </CommandList>
            </Command>
          </div>
        )}
      </div>

      {/* Scrollable Chart Area */}
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full overflow-auto cursor-grab active:cursor-grabbing",
          "scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div
          ref={chartRef}
          className="w-fit h-fit flex items-center justify-center p-80 transition-transform duration-300 ease-out will-change-transform origin-top-left"
          style={{
            transform: `scale(${zoom})`,
          }}
        >
          {orgData && (
            <TreeNode
              person={orgData}
              highlightName={highlightName}
              refMap={refMap}
              isRoot
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default OrgChart;
