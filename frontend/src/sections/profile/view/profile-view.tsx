"use client";

import { useState } from "react";
import { ProfileHeader } from "../profile-header";
import { ProfileEditModal } from "../profile-edit-modal";
import { ProfileInfoTabs } from "../profile-info-tabs";

export default function ProfileView() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blue-200/20 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader onEditClick={() => setIsEditModalOpen(true)} />
        {/* <ProfileStats /> */}
        <ProfileInfoTabs />
        
        <ProfileEditModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      </div>
    </div>
  );
}
