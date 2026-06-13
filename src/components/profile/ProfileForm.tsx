"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser, useUpdateProfile } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";
import { Save, Loader2 } from "lucide-react";

const MAX_PROFILE_PICTURE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export function ProfileForm() {
  const storeUser = useAuthStore((state) => state.user);
  const { data: profileData, isLoading: profileLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const profilePictureInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [nameEdited, setNameEdited] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  const user = profileData || storeUser;
  const displayedName = nameEdited ? name : user?.name || "";
  const existingName = (user?.name || "").trim();
  const isNameChanged = nameEdited && displayedName.trim() !== existingName;
  const isPictureChanged = !!pictureFile;
  const isDirty = isNameChanged || isPictureChanged;
  const displayedPicture = picturePreview || user?.picture || null;

  useEffect(() => {
    return () => {
      if (picturePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(picturePreview);
      }
    };
  }, [picturePreview]);

  const handlePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > MAX_PROFILE_PICTURE_BYTES) {
      toast.error("Profile picture must be less than 2MB");
      event.target.value = "";
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only PNG, JPG, and WEBP images are allowed");
      event.target.value = "";
      return;
    }

    if (picturePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(picturePreview);
    }

    setPictureFile(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    const trimmedName = displayedName.trim();

    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }

    const payload: { name?: string; picture?: File } = {};

    if (isNameChanged) {
      payload.name = trimmedName;
    }

    if (pictureFile) {
      payload.picture = pictureFile;
    }

    updateProfileMutation.mutate(payload, {
      onSuccess: (updatedUser) => {
        if (picturePreview?.startsWith("blob:")) {
          URL.revokeObjectURL(picturePreview);
        }
        setPictureFile(null);
        setName(updatedUser.name || "");
        setNameEdited(false);
        setPicturePreview(null);
      },
    });
  };

  if (profileLoading) {
    return (
      <div className="h-40 flex items-center justify-center" data-testid="profile-loading">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="profile-form">
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => profilePictureInputRef.current?.click()}
          className="relative group"
          aria-label="Change profile picture"
        >
          <Avatar className="w-20 h-20">
            {displayedPicture ? (
              <AvatarImage src={displayedPicture} alt={user?.name || "User"} />
            ) : null}
            <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 rounded-full bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors" />
        </button>
        <div>
          <h4 className="font-heading text-xl font-semibold text-slate-900">{user?.name}</h4>
          <p className="text-slate-500">{user?.email}</p>
          <p className="text-xs text-slate-500 mt-1">Click avatar to update profile image</p>
        </div>
        <Input
          ref={profilePictureInputRef}
          id="profile-picture"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handlePictureChange}
          className="hidden"
          data-testid="profile-picture-input"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            value={displayedName}
            onChange={(e) => {
              setName(e.target.value);
              setNameEdited(true);
            }}
            className="mt-1.5"
            placeholder="Your full name"
            data-testid="profile-name-input"
          />
        </div>

        {pictureFile && (
          <p className="text-xs text-slate-500">Selected image: {pictureFile.name}</p>
        )}

        <div>
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            value={user?.email || ""}
            disabled
            className="mt-1.5 bg-slate-50"
            data-testid="profile-email-input"
          />
        </div>

        <div>
          <Label htmlFor="profile-user-id">User ID</Label>
          <Input
            id="profile-user-id"
            value={user?.id || ""}
            disabled
            className="mt-1.5 bg-slate-50 font-mono text-sm"
            data-testid="profile-user-id-input"
          />
        </div>

        <div className="pt-2">
          <Button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending || !isDirty}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="save-profile-btn"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
