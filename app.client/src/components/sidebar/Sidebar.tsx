import * as React from "react";
import { GalleryVerticalEnd, Bot, Plus, Folder, HardDrive } from "lucide-react";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/Team-Switcher";
import { SecondarySidebar } from "@/components/sidebar/SidebarSubmenu";
import { useAuth } from "@/contexts/AuthContext";

import {
  MapPin,
  Barcode,
  Package,
  ShoppingCart,
  List,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  User,
  Move,
  Warehouse,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileText,
  Camera,
  Coins,
  Truck
} from "lucide-react";
import { UserService } from "@/api/services/UserService";


import { FolderIntermediateService } from "@/api/services/FolderIntermediateService";
import type { ProjectListVM } from "@/api/models/ProjectListVM";
import type { FolderListVM } from "@/api/models/FolderListVM";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  pointerWithin
} from "@dnd-kit/core";
import { Pencil, MoreVertical, Trash2, Landmark, FileSignature } from "lucide-react";
import { toast } from "sonner";
import type { FolderIntermediateListByFolderVM } from "@/api/models/FolderIntermediateListByFolderVM";

/* --------------------------------------------------------------- */
const ADMIN_EMAILS = ["iamtaranpanesar@gmail.com", "iampanesar@Gmail.com", "sumaiya.shaikh@wallop.in", "Sheetal.Shukla@wallop.in", "Parijesh.Singh@wallop.in", "trigbit.sahilrattan@gmail.com"];
const PROJECT_ADMIN_EMAILS = ["iampanesar@gmail.com", "iamtaranpanesar@gmail.com","trigbit.sahilrattan@gmail.com"];

/** Items that are hidden for non-admin users */
const ADMIN_ONLY_TITLES = new Set([
  "Barcode",
  "Warehouse",
  "WarehouseLocation",
  "InventoryItem",
  "Order",
  "Report",
  "Organisation",
]);

const PROJECT_ONLY_TITLES = new Set([
  "Projects",
  "Invoice",

  "Customers",
  "Quotes",
  "Tools",
  "Billing Items",
  "Survey",
  "Income Settings",
]);

const data = {
  teams: [{ name: "OOH", logo: GalleryVerticalEnd, plan: "" }],
  user: { name: "User", email: "user@example.com", avatar: "" },
  navMain: [
     {
      title: "Dashboard",
      url: "#",
      icon: BarChart3,
      items: [
        { title: "Dashboard", url: "/dashboard" },
      ],
    },
   
 
    {
      title: "Banks",
      url: "#",
      icon: Landmark,
      items: [
        { title: "Bank List", url: "/banks" },
        { title: "Bank Transactions", url: "/bank-transactions" },
      ],
    },
 
  
 
   
  
    {
      title: "Vendors",
      url: "#",
      icon: Truck,
      items: [
        { title: "Vendor List", url: "/vendors" },
          { title: "Vendor Category", url: "/vendor-categories" },
      ],
    },
    {
      title: "Approvals",
      url: "#",
      icon: CheckCircle2,
      items: [
        { title: "Approvals", url: "/approvals" },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: User,
      items: [
        { title: "User Management", url: "/users" },
      ],
    },
    {
      title: "Contracts",
      url: "#",
      icon: FileSignature,
      items: [
        { title: "Contract Management", url: "/contracts" },
      ],
    },
    
    // {
    //   title: "Transaction Workflow",
    //   url: "#",
    //   icon: Coins,
    //   items: [
    //     { title: "Dashboard", url: "/transactions/dashboard" },
    //     { title: "Customer Portal", url: "/transactions/customer-portal" },
    //     { title: "Vendor Portal", url: "/transactions/vendor-portal" }
    //   ],
    // },
 
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Desktop secondary-sidebar collapse
  const [collapsed, setCollapsed] = React.useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = React.useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = React.useState(false);
  const [isRenameFolderDialogOpen, setIsRenameFolderDialogOpen] = React.useState(false);
  const [folderToRename, setFolderToRename] = React.useState<{ id: string, name: string } | null>(null);
  const [targetFolderId, setTargetFolderId] = React.useState<string | null>(null);

  const [apiProjects, setApiProjects] = React.useState<ProjectListVM[]>([]);
  const [folders, setFolders] = React.useState<FolderListVM[]>([]);
  const [folderProjectsMap, setFolderProjectsMap] = React.useState<Record<string, FolderIntermediateListByFolderVM[]>>({});
  const [customProjects, setCustomProjects] = React.useState<{ title: string, url: string }[]>(() => {
    try {
      const saved = localStorage.getItem("customProjects");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Mobile drawer state from SidebarProvider
  const { openMobile, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();
  const isProjectActive = location.pathname.startsWith("/Kanban") || location.pathname.startsWith("/ProjectDashboard") || location.search.includes("projectId=");

  // Close drawer on mobile when any menu item is clicked
  const closeDrawerOnMobile = React.useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  // --- Fetch logged-in user email and Projects from API ---
  const [loggedInEmail, setLoggedInEmail] = React.useState<string | null>(null);



  React.useEffect(() => {
    UserService.getLoggedInUser("1")
      .then((res) => {
        setLoggedInEmail(res?.data?.email ?? null);
      })
      .catch(() => {
        setLoggedInEmail(null);
      });
  }, []);

 
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const customCollisionDetection = React.useCallback((args: any) => {
    const activeId = args.active.id as string;

    // If we are dragging a project, we want to be very responsive to the root projects area
    if (activeId.startsWith("project-")) {
      // First, check pointerWithin for immediate feedback
      const pointerCollisions = pointerWithin(args);

      // If we are directly over a folder, prioritize it
      const folderCollision = pointerCollisions.find(c => c.id.toString().startsWith("folder-"));
      if (folderCollision) return [folderCollision];

      // If we are anywhere inside the root-projects container, pick it
      const rootCollision = pointerCollisions.find(c => c.id === "root-projects");
      if (rootCollision) return [rootCollision];

      // Fallback to closestCenter if pointerWithin doesn't hit anything
      const centerCollisions = closestCenter(args);
      const centerFolder = centerCollisions.find(c => c.id.toString().startsWith("folder-"));
      if (centerFolder) return [centerFolder];

      const centerRoot = centerCollisions.find(c => c.id === "root-projects");
      if (centerRoot) return [centerRoot];
    }

    return closestCenter(args);
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId.startsWith("project-")) {
      const projectId = activeId.replace("project-", "");

      // Find current intermediate if any
      let currentIntermediate: FolderIntermediateListByFolderVM | undefined;
      let currentFolderId: string | undefined;

      for (const fId in folderProjectsMap) {
        const found = folderProjectsMap[fId].find(i => i.categoryId === projectId);
        if (found) {
          currentIntermediate = found;
          currentFolderId = fId;
          break;
        }
      }

      let targetFolderId: string | undefined;
      let moveToRoot = false;

      if (overId === "root-projects" || overId === "root-projects-top" || overId === "root-projects-bottom") {
        moveToRoot = true;
      } else if (overId.startsWith("folder-")) {
        targetFolderId = overId.replace("folder-", "");
      } else if (overId.startsWith("project-")) {
        // Find which folder this target project belongs to
        const targetProjectId = overId.replace("project-", "");
        for (const fId in folderProjectsMap) {
          if (folderProjectsMap[fId].some(i => i.categoryId === targetProjectId)) {
            targetFolderId = fId;
            break;
          }
        }
      }

      if (moveToRoot) {
        if (currentIntermediate?.folderIntermediateId && currentFolderId) {
          // Optimistic UI Update
          setFolderProjectsMap(prev => ({
            ...prev,
            [currentFolderId!]: prev[currentFolderId!].filter(i => i.categoryId !== projectId)
          }));

          try {
            await FolderIntermediateService.deleteFolderIntermediate(currentIntermediate.folderIntermediateId, "1");
            toast.success("Project moved to root");



          } catch (err) {
            toast.error("Failed to move project out of folder");

          }
        }
      } else if (targetFolderId) {
        // If already in this folder, do nothing
        if (currentFolderId === targetFolderId) return;

        // Optimistic UI Update
        setFolderProjectsMap(prev => {
          const newMap = { ...prev };
          if (currentFolderId) {
            newMap[currentFolderId] = (newMap[currentFolderId] || []).filter(i => i.categoryId !== projectId);
          }
          const optimisiticItem = currentIntermediate || { categoryId: projectId, category: "Project", folderId: targetFolderId };
          newMap[targetFolderId] = [...(newMap[targetFolderId] || []), optimisiticItem];
          return newMap;
        });

        try {
          if (currentIntermediate?.folderIntermediateId) {
            // Use PUT to update the relationship
            await FolderIntermediateService.putApiVFolderIntermediate("1", {
              folderIntermediateId: currentIntermediate.folderIntermediateId,
              folderId: targetFolderId,
              category: "Project",
              categoryId: projectId,
              isActive: true
            } as any);
          } else {
            // Use POST for new relationship
            await FolderIntermediateService.postApiVFolderIntermediate("1", {
              folderId: targetFolderId,
              category: "Project",
              categoryId: projectId
            } as any);
          }

          toast.success("Project moved successfully");
     


        } catch (err) {
          console.error("Move failed:", err);
          toast.error("Failed to move project");


        }
      }
    }
  };

  // Show all items for admin, only "Operation" for everyone else
  const visibleNavItems = React.useMemo(() => {
    let baseItems = data.navMain;
    const isAdmin = loggedInEmail && ADMIN_EMAILS.includes(loggedInEmail);
    const isProjectAdmin = loggedInEmail && PROJECT_ADMIN_EMAILS.includes(loggedInEmail);

    const allowedSurveyEmails = ["iamtaranpanesar@gmail.com", "trigbit.sahilrattan@gmail.com"];
    const isSurveyUser = loggedInEmail && allowedSurveyEmails.includes(loggedInEmail.toLowerCase());

    baseItems = baseItems.filter((item) => {
      if (item.title === "Survey") {
        return isSurveyUser;
      }
      return true;
    });

    if (!isAdmin) {
      baseItems = baseItems.filter((item) => !ADMIN_ONLY_TITLES.has(item.title));
    }

    if (!isProjectAdmin) {
      baseItems = baseItems.filter((item) => {
        if (item.title === "Survey") return isSurveyUser;
        return !PROJECT_ONLY_TITLES.has(item.title);
      });
    }

    return baseItems.map(item => {
      if (item.title === "Projects") {
        // Find projects not in any folder
        const allProjectIdsInFolders = Object.values(folderProjectsMap).flat().map(i => i.categoryId);
        const projectsNotInFolders = apiProjects.filter(p => !allProjectIdsInFolders.includes(p.projectId!));

        return {
          ...item,
          id: "root-projects",
          action: (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center justify-center rounded-md hover:text-white transition-colors h-5 w-5 hover:bg-white/10"
                  title="Project Options"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-48 bg-[#2C2C2C] text-white border-white/5">
                <DropdownMenuItem onClick={() => { setTargetFolderId(null); setIsProjectDialogOpen(true); }} className="cursor-pointer hover:bg-white/5">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create project</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsFolderDialogOpen(true)} className="cursor-pointer hover:bg-white/5">
                  <Folder className="mr-2 h-4 w-4" />
                  <span>Create folder</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
          items: [
            ...folders.map(f => {
              const nestedIntermediates = folderProjectsMap[f.folderId!] || [];
              const nestedProjectIds = nestedIntermediates.map(i => i.categoryId);
              const nestedProjects = apiProjects.filter(p => nestedProjectIds.includes(p.projectId!));

              return {
                title: f.name ?? "Untitled Folder",
                url: "#",
                icon: Folder,
                id: `folder-${f.folderId}`,
                action: (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-4 w-4 opacity-70 hover:opacity-100 flex items-center justify-center">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-48 bg-[#2C2C2C] text-white border-white/5">
                      <DropdownMenuItem onClick={() => { setTargetFolderId(f.folderId!); setIsProjectDialogOpen(true); }} className="cursor-pointer hover:bg-white/5">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Create project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setFolderToRename({ id: f.folderId!, name: f.name! }); setIsRenameFolderDialogOpen(true); }} className="cursor-pointer hover:bg-white/5">
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Rename folder</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5" />
                      
                    </DropdownMenuContent>
                  </DropdownMenu>
                ),
                items: nestedProjects.map(p => ({
                  title: p.name ?? "Untitled Project",
                  url: `/Kanban?projectId=${p.projectId}`,
                  icon: List,
                  id: `project-${p.projectId}`,
                  action: (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-3 w-3 opacity-0 group-hover/sub:opacity-70 hover:opacity-100 flex items-center justify-center">
                          <MoreVertical className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" className="w-48 bg-[#2C2C2C] text-white border-white/5">
                        <DropdownMenuItem
                          onClick={() => navigate(`/ProjectDashboard?projectId=${p.projectId}`)}
                          className="cursor-pointer hover:bg-white/5"
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }))
              };
            }),
            ...projectsNotInFolders.map(p => ({
              title: p.name ?? "Untitled Project",
              url: `/Kanban?projectId=${p.projectId}`,
              icon: List,
              id: `project-${p.projectId}`,
              action: (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-3 w-3 opacity-0 group-hover/sub:opacity-70 hover:opacity-100 flex items-center justify-center">
                      <MoreVertical className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-48  text-white border-white/5">
                    <DropdownMenuItem
                      onClick={() => navigate(`/ProjectDashboard?projectId=${p.projectId}`)}
                      className="cursor-pointer hover:bg-white/5"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                     
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })),
            ...customProjects
          ]
        };
      }
      return item;
    });
  }, [loggedInEmail, apiProjects, folders, folderProjectsMap, customProjects]);

  const userWithLogout = data.user
    ? { ...data.user, onLogout: logout }
    : { name: "", email: "", avatar: "", onLogout: logout };

  return (
    <div className="flex h-screen sticky top-0">
      <Sidebar
        collapsible="offcanvas" // mobile drawer
        {...props}
      >
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent>
          <DndContext sensors={sensors} collisionDetection={customCollisionDetection} onDragEnd={handleDragEnd}>
            <NavMain items={visibleNavItems} onItemSelect={closeDrawerOnMobile} />
          </DndContext>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={userWithLogout} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Secondary sidebar - Only visible for Projects for specific admins */}
      {(isProjectActive && loggedInEmail && PROJECT_ADMIN_EMAILS.includes(loggedInEmail)) && <SecondarySidebar />}
 
    </div>
  );
}
