import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./user-profile-imgs.css";
import { dittoSprite } from "../../../assets/others-sprites";
import { missigno } from "../../../assets/lobby-page";
import EditProfileModal from "../EditProfileModal/edit-profile-modal";

import axios from "axios";
import { apiUrl } from "../../../config/consts";
import { useRequireAuth } from "../../../auth/useRequireAuth";
import { usePokemonData } from "../../../utils/usePokemonData";

type UserProfileUpdate = {
  username: string;
  profileDescription: string;
  favoritePokemonId?: number;
  password?: string;
  profileImgUrl?: string;
};

const UserProfileImgs: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);

  const [profileImg, setProfileImage] = useState<string | null>(null);

  const auth = useRequireAuth();
  const { currentUser, refreshCurrentUser, token } = auth;

  const defaultProfileImage = `https://ui-avatars.com/api/?name=${
    currentUser?.username || "US"
  }`;

  const navigate = useNavigate();

  const { spriteUrl, loading } = usePokemonData(currentUser?.favoritePokemonId);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.profileImgUrl) {
      setProfileImage(currentUser.profileImgUrl);
    } else {
      setProfileImage(defaultProfileImage);
    }
  }, [currentUser?.profileImgUrl]);

  if (!currentUser) return null;

  const handleDeleteProfile = () => {
    const confirmation = window.confirm(
      "¿Estás seguro de que quieres eliminar tu perfil? Te vamos a echar mucho de menos..."
    );
    if (!confirmation) return;

    // Empezar la consulta DELETE

    axios
      .delete(`${apiUrl}/users/${currentUser.id}`)
      .then(() => {
        console.log("Perfil eliminado");
        navigate("/logout");
      })
      .catch((error) => {
        console.error("Error al eliminar el perfil:", error);
      });
  };

  const handleSaveProfile = async (
    newUsername: string,
    newDescription: string,
    newFavoritePokemonId: number | null,
    newPassword: string | null,
    profileImg: File | null
  ) => {
    const body: UserProfileUpdate = {
      username: newUsername,
      profileDescription: newDescription,
    };
    if (newFavoritePokemonId !== null) body.favoritePokemonId = newFavoritePokemonId;
    if (newPassword) body.password = newPassword;

    if (profileImg) {
      try {
        const imageFormData = new FormData();
        imageFormData.append("file", profileImg);

        const uploadResponse = await axios.post(
          `${apiUrl}/images/upload-profile/${currentUser.id}`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        const uploadedUrl = uploadResponse.data?.imageUrl;
        if (uploadedUrl) {
          body.profileImgUrl = uploadedUrl;
        }
      } catch (error: unknown) {
        let backendMessage = "Error al subir la imagen";
        if (axios.isAxiosError(error) && error.response?.data?.error) {
          backendMessage = error.response.data.error;
        }
        alert(backendMessage);
        console.error("Error al subir la imagen:", error);
      }
    }

    try {
      await axios.patch(`${apiUrl}/users/${currentUser.id}`, body, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      console.log("Perfil actualizado");
      // Después de actualizar el perfil y antes de refrescar el usuario:
      refreshCurrentUser();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  return (
    <div className="user-profile-imgs">
      <div className="user-profile-imgs__profile-img-container">
        <img
          src={profileImg || defaultProfileImage}
          alt="Profile"
          className="user-profile-imgs__profile-img"
        />
      </div>
      <div className="user-profile-imgs__fav-pokemon-container">
        <h2 className="user-profile-imgs__title"> {loading ? "Obteniendo imagen..." : "Pokémon Preferido"} </h2>
        <img
          src={spriteUrl || missigno}
          alt="Favorite Pokémon"
          className="user-profile-imgs__fav-pokemon-img"
          draggable={false}
        />
      </div>
      <div className="user-profile-imgs__editto-container">
        <button
          className="user-profile-imgs__editto-button"
          onClick={() => setShowEditModal(true)}
        >
          <p> Editto </p>
          <img
            src={dittoSprite}
            alt="Ditto"
            className="user-profile-imgs__ditto-img"
          />
        </button>
        <button
          className="user-profile-imgs__delete-button"
          onClick={handleDeleteProfile}
        >
          <p> Eliminar Perfil </p>
        </button>
      </div>
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfileImgs;
