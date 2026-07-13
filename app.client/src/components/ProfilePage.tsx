"use client";

import { useState, useCallback, useRef, type ChangeEvent } from "react";
import Cropper from "react-easy-crop";
import * as Popover from "@radix-ui/react-popover";

import { getCroppedImg } from "@/utils/cropToBlob";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User2, Loader2 } from "lucide-react";
import ChangePasswordForm from "@/modules/auth/changePassword";
import { toast } from "sonner";

export const ProfilePage = () => {
  /* ------------------------------------------------------------------ */
  /* profile fields ---------------------------------------------------- */
  const [firstName, setFirstName] = useState("Sahil");
  const [lastName, setLastName] = useState("Rattan");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");

  /* ------------------------------------------------------------------ */
  /* avatar / cropper state ------------------------------------------- */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedPixelsRef = useRef<any>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);

  /* ------------------------------------------------------------------ */
  /* callbacks --------------------------------------------------------- */
  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    croppedPixelsRef.current = croppedAreaPixels;
  }, []);

  const openFileDialog = () => document.getElementById("avatar-input")?.click();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setShowDialog(true);
  };

  const saveCropped = async () => {
    if (!file) return;
    try {
      setSavingAvatar(true);

      const blob = await getCroppedImg(file, croppedPixelsRef.current);
      const url = URL.createObjectURL(blob); // TODO: upload for real
      setAvatarUrl(url);

      toast.success("Profile image updated");
    } catch (err) {
      toast.error("Failed to update image");
    } finally {
      setSavingAvatar(false);
      setShowDialog(false);
    }
  };

  const deleteAvatar = () => {
    setAvatarUrl(null);
    toast.success("Profile image removed", {
      description: "Re‑upload anytime.",
    });
  };
  const handleSaveProfile = () => console.log("Profile saved");

  /* ------------------------------------------------------------------ */
  /* render ------------------------------------------------------------ */
  return (
    <div className="min-h-screen">
      {/* hidden input for file selection */}
      <input
        id="avatar-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* avatar crop dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adjust profile picture</DialogTitle>
          </DialogHeader>

          {file && (
            <div className="relative h-72 rounded-lg overflow-hidden bg-gray-100">
              <Cropper
                image={URL.createObjectURL(file)}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowDialog(false)}
              disabled={savingAvatar}
            >
              Cancel
            </Button>

            <Button onClick={saveCropped} disabled={savingAvatar}>
              {savingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* main page content */}
      <div className="max-w-5xl mx-auto px-5 py-6">
        <Tabs defaultValue="profile" className="w-full">
          {/* tabs header */}
          <TabsList className="flex w-full gap-8 border-b">
            {["profile", "preferences", "integrations", "security"].map(
              (tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 font-medium text-base capitalize"
                >
                  {tab}
                </TabsTrigger>
              )
            )}
          </TabsList>

          {/* ---------------- PROFILE TAB ---------------- */}
          <TabsContent value="profile" className="mt-8 space-y-8">
            {/* avatar + name */}
            <div className="flex items-center gap-4">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <div className="relative cursor-pointer group">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <Avatar className="h-16 w-16 bg-gray-200">
                        <AvatarFallback className="flex h-full w-full items-center justify-center">
                          <User2 className="h-8 w-8 text-gray-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    sideOffset={8}
                    className="rounded-md bg-white shadow-lg p-2 w-40"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={openFileDialog}
                    >
                      Update image…
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm text-red-600"
                      onClick={deleteAvatar}
                    >
                      Delete image
                    </Button>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              {/* name & email */}
              <div>
                <h2 className="text-xl font-semibold">
                  {firstName} {lastName}
                </h2>
                <p>
                  sahilrattan79@gmail.com{" "}
                  <button className="text-blue-600 hover:underline text-sm ml-2">
                    change email
                  </button>
                </p>
              </div>
            </div>

            {/* ------------- FORM FIELDS ------------- */}
            <div className="space-y-6">
              {/* names */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              {/* country & phone */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country
                  </Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md">
                      <span className="text-sm">+000</span>
                    </div>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="000 000 00 00"
                      className="border-gray-300 rounded-l-none focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* location & birthday */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Birthday</Label>
                  <div className="flex gap-2">
                    <Input
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      placeholder="Day"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                    />
                    <Select value={month} onValueChange={setMonth}>
                      <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((m, i) => (
                          <SelectItem
                            key={m}
                            value={(i + 1).toString().padStart(2, "0")}
                          >
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* save button */}
            <div>
              <Button
                onClick={handleSaveProfile}
                className="bg-primary hover:bg-primary/90 text-white px-6"
              >
                Save
              </Button>
            </div>

            {/* delete account */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold">Delete account</h3>
              <p className="text-sm mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </Button>
            </div>
          </TabsContent>

          {/* ---------------- PREFERENCES ---------------- */}
          <TabsContent value="preferences">
            <div className="py-12 text-center text-gray-500">
              Preferences content coming soon…
            </div>
          </TabsContent>

          {/* ---------------- INTEGRATIONS --------------- */}
          <TabsContent value="integrations">
            <div className="py-12 text-center text-gray-500">
              Integrations content coming soon…
            </div>
          </TabsContent>

          {/* ---------------- SECURITY ------------------- */}
          <TabsContent value="security">
            <div className="pt-8 border-t border-gray-200">
              <ChangePasswordForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
