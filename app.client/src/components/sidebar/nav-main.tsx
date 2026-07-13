"use client";

import * as React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useDraggable, useDroppable, useDndContext } from "@dnd-kit/core";
import { cn } from "@/utils/cn";

interface NavMainProps {
  items: {
    id?: string;
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      id?: string;
      title: string;
      url: string;
      icon?: LucideIcon;
      action?: React.ReactNode;
      items?: { id?: string; title: string; url: string; icon?: LucideIcon; action?: React.ReactNode }[];
    }[];
    action?: React.ReactNode;
  }[];
  /** Called on every click – we close the mobile drawer */
  onItemSelect?: () => void;
}

const DraggableItem = React.forwardRef<HTMLDivElement, { id: string, children: React.ReactNode, className?: string }>(
  ({ id, children, className, ...props }, ref) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id,
    });

    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      zIndex: 999,
    } : undefined;

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        style={style}
        {...listeners}
        {...attributes}
        {...props}
        className={cn(className, isDragging && "opacity-50 grayscale cursor-grabbing", "cursor-grab")}
      >
        {children}
      </div>
    );
  }
);
DraggableItem.displayName = "DraggableItem";

const DroppableItem = React.forwardRef<HTMLDivElement, { id: string, children: React.ReactNode, className?: string }>(
  ({ id, children, className, ...props }, ref) => {
    const { isOver, setNodeRef } = useDroppable({
      id,
    });

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        {...props}
        className={cn(className, isOver && "bg-white/10 rounded-md ring-1 ring-white/20")}
      >
        {children}
      </div>
    );
  }
);
DroppableItem.displayName = "DroppableItem";

export const NavMain = ({ items, onItemSelect }: NavMainProps) => {
  const handleClick = () => onItemSelect?.();
  const { active } = useDndContext();
  const isDraggingProject = active?.id.toString().startsWith("project-");

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isDroppableRoot = item.id === "root-projects";
          const content = (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {/* ---- Top-level with sub-items ---- */}
                {item.items ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="cursor-pointer">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.action && (
                      <div
                        className="absolute right-8 top-1.5 z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        {item.action}
                      </div>
                    )}

                    <CollapsibleContent>
                      <SidebarMenuSub className={cn("relative transition-all duration-300", isDroppableRoot && isDraggingProject && "pb-80 pt-4")}>
                        {item.items.map((sub, idx) => {
                          const hasSubItems = sub.items && sub.items.length > 0;
                          const isDraggableSub = sub.id?.startsWith("project-");
                          const isDroppableSub = sub.id?.startsWith("folder-");

                          const subItemContent = (
                            <div className="relative group/sub w-full">
                              <SidebarMenuSubButton asChild>
                                {sub.url && sub.url !== "#" ? (
                                  <Link to={sub.url} onClick={handleClick} className="flex items-center w-full">
                                    {sub.icon && <sub.icon className="h-4 w-4 shrink-0" />}
                                    <span className="truncate">{sub.title}</span>
                                    {hasSubItems && (
                                      <ChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible-sub:rotate-90" />
                                    )}
                                  </Link>
                                ) : (
                                  <div className="flex items-center w-full cursor-pointer">
                                    {sub.icon && <sub.icon className="h-4 w-4 shrink-0" />}
                                    <span className="truncate">{sub.title}</span>
                                    {hasSubItems && (
                                      <ChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible-sub:rotate-90" />
                                    )}
                                  </div>
                                )}
                              </SidebarMenuSubButton>
                              {sub.action && (
                                <div
                                  className={cn(
                                    "absolute top-0.5 z-10 opacity-0 group-hover/sub:opacity-100 transition-opacity flex items-center h-full",
                                    hasSubItems ? "right-6" : "right-2"
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  {sub.action}
                                </div>
                              )}
                            </div>
                          );

                          let wrappedSubItemContent = subItemContent;
                          if (isDraggableSub) wrappedSubItemContent = <DraggableItem id={sub.id!}>{subItemContent}</DraggableItem>;
                          
                          const collapsibleContent = hasSubItems ? (
                            <Collapsible asChild className="group/collapsible-sub">
                              <div>
                                <CollapsibleTrigger asChild>
                                  {wrappedSubItemContent}
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub className="ml-4 border-l border-white/5 pl-2 mt-1">
                                    {sub.items?.map((nested, nIdx) => {
                                      const isDraggableNested = nested.id?.startsWith("project-");
                                      const nestedItemContent = (
                                        <>
                                          <SidebarMenuSubButton asChild>
                                            <Link to={nested.url} onClick={handleClick} className="flex items-center w-full">
                                              {nested.icon && <nested.icon className="h-3 w-3 shrink-0" />}
                                              <span className="text-xs truncate">{nested.title}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                          {nested.action && (
                                            <div
                                              className="absolute right-2 top-0.5 z-10 opacity-0 group-hover/nested:opacity-100 transition-opacity flex items-center h-full"
                                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            >
                                              {nested.action}
                                            </div>
                                          )}
                                        </>
                                      );

                                      return (
                                        <SidebarMenuSubItem key={`${nested.title}-${nIdx}`} className="group/nested relative">
                                          {isDraggableNested ? (
                                            <DraggableItem id={nested.id!}>{nestedItemContent}</DraggableItem>
                                          ) : (
                                            nestedItemContent
                                          )}
                                        </SidebarMenuSubItem>
                                      );
                                    })}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          ) : (
                            wrappedSubItemContent
                          );

                          return (
                            <SidebarMenuSubItem key={`${sub.title}-${idx}`} className="group/sub relative">
                              {isDroppableSub ? (
                                <DroppableItem id={sub.id!}>
                                  {collapsibleContent}
                                </DroppableItem>
                              ) : (
                                collapsibleContent
                              )}
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  /* ---- Simple top-level item ---- */
                  <>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} onClick={handleClick}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.action && (
                      <div
                        className="absolute right-2 top-1.5 z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        {item.action}
                      </div>
                    )}
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );

          if (isDroppableRoot) return <DroppableItem key={item.title} id={item.id!} className={cn("transition-all duration-300", isDraggingProject && "bg-white/[0.02] ring-1 ring-white/5 rounded-lg p-12 -m-12")}>{content}</DroppableItem>;
          return content;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};