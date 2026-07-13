"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Edit3,
  Info,
  Mail,
  Phone,
  EyeOff,
  Eye,
  ShieldCheck,
  UserCheck,
  Camera,
  Upload,
  X
} from "lucide-react";
import { UserService } from "@/api/services/UserService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { getFileExtension, getMimeType } from "@/utils/file-utils";
import { toast } from "sonner";

const API_VERSION = "1";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onSuccess: () => void;
}

export const UserFormDialog = ({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) => {
  const [formData, setFormData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || "",
        id: user.id || user.userID,
        isActive: user.isActive,
        createdDate: user.createdDate,
        password: "",
        confirmPassword: "",
      });
      // Fetch existing image if editing? 
      // For now we'll just handle new uploads.
      setImagePreview(null);
      setImageFile(null);
    } else {
      setFormData({});
      setImagePreview(null);
      setImageFile(null);
    }
  }, [user, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "email", "phoneNumber"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }
    if (!user && (!formData.password || !formData.confirmPassword)) {
      toast.error("Password and confirm password are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (user) {
        const updatePayload = {
          Id: formData.id,
          userID: formData.id,
          email: formData.email,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          ...(formData.password ? { password: formData.password } : {}),
        };
        await UserService.putApiVUser(API_VERSION, updatePayload);
        toast.success("User updated successfully");
      } else {
        const createPayload = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userName: formData.email,
          phoneNumber: formData.phoneNumber?.toString() || "",
        };
        const res = await UserService.postApiVUser(API_VERSION, createPayload);
        toast.success("User created successfully");

        // Handle Image Upload if selected
        if (imageFile && imagePreview) {
          const userId = (res as any).data?.id || (res as any).id;
          if (userId) {
            try {
              const base64Content = imagePreview.split(",")[1];
              const ext = getFileExtension(imageFile.name);
              const extension = ext.startsWith(".") ? ext : `.${ext}`;

              const docCmd = {
                name: `profile-${userId}${extension}`,
                documentFileName: imageFile.name,
                description: `Profile image for user ${userId}`,
                content: base64Content,
                category: "User",
                categoryId: userId,
                extension: extension,
                contentType: imageFile.type || getMimeType(imageFile.name),
              } as any;

              await DocumentsService.postApiVDocuments(API_VERSION, docCmd);
              toast.success("Profile image uploaded");
            } catch (err) {
              console.error("Image upload failed", err);
              toast.error("User created but profile image upload failed");
            }
          }
        }
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save user information");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const updatePayload = {
        Id: formData.id,
        userID: formData.id,
        email: formData.email,
        Email: formData.email,
        userName: formData.email,
        UserName: formData.email,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        phoneNumber: formData.phoneNumber?.toString() || "",
        ...(formData.password ? { password: formData.password } : {}),
      };
      await UserService.putApiVUser(API_VERSION, updatePayload as any);

      // Handle Image Upload for update
      if (imageFile && imagePreview) {
        try {
          const base64Content = imagePreview.split(",")[1];
          const ext = getFileExtension(imageFile.name);
          const extension = ext.startsWith(".") ? ext : `.${ext}`;

          const docCmd = {
            name: `profile-${formData.id}${extension}`,
            documentFileName: imageFile.name,
            description: `Updated profile image for user ${formData.id}`,
            content: base64Content,
            category: "User",
            categoryId: formData.id,
            extension: extension,
            contentType: imageFile.type || getMimeType(imageFile.name),
          } as any;

          await DocumentsService.postApiVDocuments(API_VERSION, docCmd);
          toast.success("Profile image updated");
        } catch (err) {
          console.error("Image upload failed", err);
          toast.error("Profile updated but image upload failed");
        }
      }

      toast.success("User updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to update user information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-muted shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-1">
            <div className={`p-2 rounded-lg ${user ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"}`}>
              {user ? <Edit3 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <DialogTitle className="text-xl font-bold">
              {user ? "Modify System User" : "Create New Access Account"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            Fill in the profile details below to manage system access and identity.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Enhanced Image Selector */}
          <div className="flex flex-col items-center justify-center pb-2">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted/30 transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground/40" />
                )}

                <label
                  htmlFor="user-image-upload"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Upload className="h-5 w-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Upload</span>
                </label>
              </div>

              {imagePreview && (
                <button
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg border-2 border-background hover:scale-110 transition-transform"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <input
              id="user-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-[10px] text-muted-foreground font-medium mt-2 uppercase tracking-wider">Profile Picture</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs font-bold text-muted-foreground uppercase opacity-70">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName || ""}
                onChange={handleChange}
                className="rounded-xl border-muted-foreground/20 h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs font-bold text-muted-foreground uppercase opacity-70">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="rounded-xl border-muted-foreground/20 h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase opacity-70">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email || ""}
              onChange={handleChange}

              className="rounded-xl border-muted-foreground/20 h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber" className="text-xs font-bold text-muted-foreground uppercase opacity-70">Contact Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              className="rounded-xl border-muted-foreground/20 h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 relative">
              <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase opacity-70">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password || ""}
                  onChange={handleChange}
                  className="rounded-xl border-muted-foreground/20 h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5 relative">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-muted-foreground uppercase opacity-70">Confirm</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword || ""}
                  onChange={handleChange}
                  className="rounded-xl border-muted-foreground/20 h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted/20 border-t border-muted/60 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={user ? handleUpdate : handleSubmit} disabled={loading} className="rounded-xl shadow-lg shadow-primary/20 bg-primary px-8">
            {user ? "Update Profile" : "Activate User Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
