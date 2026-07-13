"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export const ImageUpload = () => {
  const [selectImage, setSelectImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectImage(e.target.files[0]);
    }
  };

  const handleDeleteImage = () => {
    setSelectImage(null);
  };

  return (
    <div className="flex flex-col items-start gap-4 p-4 border rounded-md max-w-sm bg-white shadow">
      <label className="w-full">
        <span className="block mb-2 font-medium text-gray-700">
          Upload Image
        </span>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full cursor-pointer"
        />
      </label>

      {selectImage && (
        <div className="flex items-center gap-4 border p-2 rounded-md w-full relative">
          <img
            src={URL.createObjectURL(selectImage)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-md"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{selectImage.name}</p>
            <p className="text-xs text-gray-500">
              {(selectImage.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={handleDeleteImage}
            className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full"
            aria-label="Remove image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
