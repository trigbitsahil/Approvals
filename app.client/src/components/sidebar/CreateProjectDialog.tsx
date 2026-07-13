import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import type { CreateProjectCommand } from "@/api/models/CreateProjectCommand";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectCommand) => void;
  userEmail: string | null;
}

export function CreateProjectDialog({ isOpen, onClose, onSubmit, userEmail }: CreateProjectDialogProps) {
  const [projectName, setProjectName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    onSubmit({
      name: projectName.trim(),
      description: description.trim(),
      startDate: startDate ? `${startDate}T00:00:00` : null,
      endDate: endDate ? `${endDate}T00:00:00` : null,
      status: "PrjctStatus_0b6b35cb-5a99-42c2-9cf7-8bc9c481d272", // Default Status ID
    });

    // Reset fields
    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      setProjectName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#2C2C2C] text-white border-none p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-white mb-2">Create project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-[#a1a1a1]">Project Name</label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className=" h-11 w-full rounded text-[15px]"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-[#a1a1a1]">Description</label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="  focus-visible:ring-1  min-h-[80px] w-full rounded text-[15px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium text-[#a1a1a1]">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className=" h-11 w-full rounded text-[15px] [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium text-[#a1a1a1]">End Date</label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className=" h-11 w-full rounded text-[15px] [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center text-[15px]">
              <span className="text-[#a1a1a1]">Members <span className="bg-[#242424] px-2 py-0.5 rounded-[50px] ml-2 text-xs font-semibold text-[#a1a1a1]">1</span></span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-600 font-medium text-white shrink-0 relative text-sm">
                {userEmail ? userEmail.charAt(0).toUpperCase() : "S"}
                <span className="absolute -top-1 -left-1 text-[10px] text-[#0055ff]">★</span>
              </div>
              <span className="text-[15px] text-white">
                {userEmail && userEmail !== "user@example.com" ? userEmail : "Sahil Rattan"}
              </span>
            </div>

            <button type="button" className="flex items-center text-[#a1a1a1] hover:text-white transition-colors text-[15px] font-medium mt-1 cursor-pointer">
              <Plus className="h-4 w-4 mr-2" /> Add people
            </button>
          </div>

          <DialogFooter className="mt-8 border-t border-white/10 p-4 -mx-6 -mb-6 flex justify-end gap-3 rounded-b-lg">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-[#a1a1a1] hover:text-white hover:bg-transparent px-4 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!projectName.trim()}
              className={`px-4 font-medium rounded transition-colors ${projectName.trim()
                ? "bg-[#0055ff]  text-white"
                : "bg-white/10 text-white/50 cursor-not-allowed"
                }`}
            >
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
