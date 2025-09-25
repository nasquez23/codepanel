"use client";

import { useRef, useState } from "react";
import { Camera, Trash2, Upload, User, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { useUploadProfilePicture, useRemoveProfilePicture } from "@/hooks";
import { toast } from "sonner";
import ProfilePicture from "./profile-picture";

interface AvatarUploadProps {
  currentImageUrl?: string;
  onUploadSuccess?: () => void;
  onRemoveSuccess?: () => void;
}

export default function AvatarUpload({
  currentImageUrl,
  onUploadSuccess,
  onRemoveSuccess,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadMutation = useUploadProfilePicture();
  const removeMutation = useRemoveProfilePicture();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = () => {
    if (!selectedFile) return;

    uploadMutation.mutate(selectedFile, {
      onSuccess: () => {
        setPreview(null);
        setSelectedFile(null);
        onUploadSuccess?.();
      },
      onError: () => {
        toast.error("Failed to upload profile picture");
      },
    });
  };

  const handleCancelUpload = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    removeMutation.mutate(undefined, {
      onSuccess: () => {
        onRemoveSuccess?.();
      },
    });
  };

  const displayImage = preview || currentImageUrl;
  const isLoading = uploadMutation.isPending || removeMutation.isPending;
  const hasPreview = !!preview && !!selectedFile;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div
          className={`w-32 h-32 rounded-full border-4 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer ${
            hasPreview ? "border-blue-400" : "border-gray-200"
          } ${isLoading ? "opacity-50" : ""}`}
          onClick={() => !isLoading && fileInputRef.current?.click()}
        >
          <ProfilePicture
            profilePictureUrl={displayImage}
            firstName={""}
            lastName={""}
            className="w-full h-full"
          />
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {!isLoading && !hasPreview && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-8 h-8 text-white" />
          </div>
        )}

        {hasPreview && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
            <div className="w-4 h-4 flex items-center justify-center text-xs font-bold">
              !
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        {hasPreview ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-600">
              Preview ready - confirm to upload
            </p>
            <p className="text-xs text-gray-500">
              {selectedFile?.name} (
              {((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)}MB)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Click to select a different image
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Click to select an image
            </p>
            <p className="text-xs text-gray-500">
              Supports: JPEG, PNG, WebP • Max size: 5MB
            </p>
          </>
        )}
      </div>

      <div className="flex space-x-2">
        {hasPreview ? (
          <>
            <Button
              onClick={handleConfirmUpload}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
              <span>{isLoading ? "Uploading..." : "Confirm Upload"}</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleCancelUpload}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Select Image</span>
            </Button>

            {currentImageUrl && !hasPreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={isLoading}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </Button>
            )}
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
