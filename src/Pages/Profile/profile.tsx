import React from "react";

import "./profile.css";
import UserProfileImgs from "../../Components/ProfileComponents/UserProfileImgs/user-profile-imgs";
import UserInfoCard from "../../Components/ProfileComponents/UserInfoCard/user-info-card";


import { useRequireAuth } from "../../auth/useRequireAuth";

import type { RibbonClass } from "../../Components/ProfileComponents/ribbon-types";

const adquiredRibbons: Array<[RibbonClass, number]> = [
  ["hoenn", 0],
  ["hoenn", 1],
  ["hoenn", 5],
];

const Profile: React.FC = () => {
  // Obtener token de autenticación del contexto

  const auth = useRequireAuth();

  const { token } = auth;

  if (!token) return null;

  return (

    
    <div className="profile-container">
      <div className="profile-content">
        <UserProfileImgs/>
        <UserInfoCard adquiredRibbons={adquiredRibbons} />
      </div>
    </div>
  );
};

export default Profile;
