import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialValue?: string;
  title?: string;
  buttonText?: string;
}

export function CreateFolderDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialValue = "", 
  title = "Create folder",
  buttonText = "Create folder"
}: CreateFolderDialogProps) {
  const [folderName, setFolderName] = React.useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    onSubmit(folderName.trim());
    setFolderName("");
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      setFolderName(initialValue);
    }
  }, [isOpen, initialValue]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#2C2C2C] text-white border-none p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-white mb-4">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-2">
            <Input
              id="folder-name"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="bg-[#1e1e1e] border-[#FF6B6B]/20 focus-visible:border-[#FF6B6B] focus-visible:ring-1 focus-visible:ring-[#FF6B6B] h-12 w-full rounded-lg text-[15px] transition-all"
              autoFocus
              required
            />
          </div>

          <DialogFooter className="mt-8 pt-4 border-t border-white/5 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-[#a1a1a1] hover:text-white hover:bg-white/5 px-6 font-medium rounded-lg h-11"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!folderName.trim()} 
              className={`px-6 h-11 font-medium rounded-lg transition-all ${
                folderName.trim() 
                  ? "bg-white/10 hover:bg-white/15 text-white" 
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              }`}
            >
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
