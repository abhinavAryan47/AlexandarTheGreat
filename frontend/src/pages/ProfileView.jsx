import React from 'react';
import ProfileForm from '../components/ProfileForm';

export default function ProfileView({ profile, onSaveProfile }) {
  return (
    <div className="py-2">
      <ProfileForm profile={profile} onSave={onSaveProfile} />
    </div>
  );
}
