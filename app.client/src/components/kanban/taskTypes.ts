// Shared task type definitions with colors matching the design
export const TASK_TYPES = [
  { label: "Operational", color: "#2563eb" }, // blue
  { label: "Technical",   color: "#0d9488" }, // teal
  { label: "Strategic",   color: "#15803d" }, // dark green
  { label: "Hiring",      color: "#22c55e" }, // green
  { label: "Financial",   color: "#65a30d" }, // olive/lime
] as const;

export type TaskTypeName = (typeof TASK_TYPES)[number]["label"];

/** Returns the hex color for a given type label, defaults to transparent */
export function getTypeColor(label?: string | null): string {
  return TASK_TYPES.find((t) => t.label === label)?.color ?? "transparent";
}
