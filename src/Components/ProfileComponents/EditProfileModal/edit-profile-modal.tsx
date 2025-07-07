import "./edit-profile-modal.css";
import { useState, useEffect, useRef } from "react";
import { closeIcon } from "../../../assets/perfil-page";
import SelectPokemon from "../../SelectPokemon/selectpokemon";
import { missigno } from "../../../assets/lobby-page";
import { RiEditLine } from "react-icons/ri";
import { useRequireAuth } from "../../../auth/useRequireAuth";

import { usePokemonData } from "../../../utils/usePokemonData";

import { checkDescription } from "../../../Components/AuthModals/authFunctions";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    username: string,
    description: string,
    favoritePokemonId: number | null,
    new_password: string | null,
    ProfileImg: File | null
  ) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  // Context
  const auth = useRequireAuth();
  const { currentUser } = auth;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultProfileImage = `https://ui-avatars.com/api/?name=${
    currentUser?.username || "US"
  }`;
  // State
  const [username, setUsername] = useState(currentUser?.username ?? "");
  const [description, setDescription] = useState(
    currentUser?.profileDescription ?? ""
  );
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [favoritePokemonId, setFavoritePokemonId] = useState(
    currentUser?.favoritePokemonId ?? null
  );
  const [pkmImg, setPkmImg] = useState(missigno); // Default image for favorite Pokémon
  const [pkmName, setPkmName] = useState("Selecciona tu Pokémon preferido");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null); // Imagen que se va a subir
  const [profileImagePreview, setProfileImagePreview] =
    useState<string>(defaultProfileImage); // Preview de la imagen de perfil

  const [isThereChanges, setIsThereChanges] = useState(false);

  // Asegurar que se muestre la foto de perfil del user
  // en caso de que haya cerrado el modal sin guardar los cambios y vuelva a abrirlo

  useEffect(() => {
    if (isOpen) {
      setProfileImage(null);
      setProfileImagePreview(currentUser?.profileImgUrl || defaultProfileImage);
      setUsername(currentUser?.username || "No disponible");
      setDescription(currentUser?.profileDescription || "");
      setFavoritePokemonId(currentUser?.favoritePokemonId || null);
      setNewPassword(null);
      setIsEditingPassword(false);
      setIsThereChanges(false);
    }
  }, [isOpen, currentUser]);

  // Carga el nombre y la imagen del Pokémon favorito al abrir el modal

  const { spriteUrl: spriteUrl, pkmName: fetchedPkmName } =
    usePokemonData(favoritePokemonId);

  useEffect(() => {
    if (favoritePokemonId && favoritePokemonId > 0) {
      setPkmImg(spriteUrl || missigno);
      setPkmName(fetchedPkmName || "Selecciona tu Pokémon preferido");
    }
  }, [favoritePokemonId, spriteUrl, fetchedPkmName]);

  // Refs

  const usernameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const checkAnyChange = () => {
    return (
      username !== currentUser?.username ||
      description !== currentUser?.profileDescription ||
      favoritePokemonId !== currentUser?.favoritePokemonId ||
      newPassword !== null ||
      (profileImage && profileImage.name !== currentUser?.profileImgUrl)
    );
  };

  useEffect(() => {
    if (isOpen) {
      setIsThereChanges(checkAnyChange() || false);
    }
  }, [
    isOpen,
    username,
    description,
    favoritePokemonId,
    newPassword,
    profileImage,
    currentUser,
  ]);

  const checkPassword = (password: string) => {
    if (password.length < 8) {
      if (passwordRef.current) {
        passwordRef.current.setCustomValidity(
          "La contraseña debe tener al menos 8 caracteres"
        );
        passwordRef.current.reportValidity();
      }
      return false;
    }

    if (passwordRef.current) {
      passwordRef.current.setCustomValidity("");
    }

    return true;
  };

  const handlePasswordEditClick = () => {
    if (isEditingPassword) {
      // Solo validar si el usuario está confirmando el cambio
      if (newPassword &&!checkPassword(newPassword)) {
        // Si es inválida, no salir del modo edición
        return;
      }
      setIsEditingPassword(false);
    } else {
      if (passwordRef.current) {
        passwordRef.current.setCustomValidity("");
      }
      setIsEditingPassword(true);
      setNewPassword(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    // Limpiar mensaje de error mientras el usuario escribe
    if (passwordRef.current) {
      passwordRef.current.setCustomValidity("");
    }
  };

  const handleSavePokemon = (
    pokemonImage: string,
    pokedex: number,
    pokemonName?: string
  ) => {
    setPkmImg(pokemonImage);
    setFavoritePokemonId(pokedex);
    if (pokemonName) {
      setPkmName(pokemonName);
    }
    setShowModal(false);
  };

  const handleProfileImgClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadProfileImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file)); // Para mostrar preview
    }
  };
  const handleSave = async () => {

    if (!isThereChanges) {
      onClose();
      return;
    }

    if (isEditingPassword) {
      if (passwordRef.current) {
        passwordRef.current.setCustomValidity(
          "Por favor, termina de editar la contraseña"
        );
        passwordRef.current.reportValidity();
      }
      return;
    }

    setLoading(true);

    // Solo pasa la imagen si realmente cambió
    let profileImgToSend: File | null = null;
    if (profileImage) {
      profileImgToSend = profileImage;
    }

    await onSave(
      username,
      description,
      favoritePokemonId,
      newPassword,
      profileImgToSend
    ).finally(() => setLoading(false));
  };

  return (
    <div
      className={`edit-modal__container ${
        isOpen ? "edit-modal__container--open" : ""
      }`}
    >
      <div className="edit-modal__content">
        <div className="edit-modal__header">
          <div className="edit-modal__close">
            <img
              src={closeIcon}
              alt="Cerrar"
              className="edit-modal__close-icon"
              onClick={() => {
                if (isThereChanges || isEditingPassword) {
                  if (
                    window.confirm(
                      "¿Estás seguro de que quieres cerrar el modal sin guardar los cambios?"
                    )
                  ) {
                    onClose();
                  } else {
                    return;
                  }
                } else {
                  onClose();
                }
              }}
            />
          </div>
          <div className="edit-modal__title">
            <h2>Editar</h2>
          </div>
          <div className="edit-modal__profile-img-container">
            <img
              src={profileImagePreview}
              alt="Imagen de perfil"
              className="edit-modal__profile-img"
              onClick={handleProfileImgClick}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleUploadProfileImage}
            />
            <p className="edit-modal__profile-edit-text"> Cambiar imagen </p>
          </div>
        </div>
        <form
          className="edit-modal__form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <p className="edit-modal__input-title"> Nombre de usuario </p>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            ref={usernameRef}
            required
          />

          <p className="edit-modal__input-title"> Descripción </p>
          <input
            type="text"
            placeholder="Descripción"
            value={description}
            onChange={(e) => {
              if (checkDescription(e.target.value, descriptionRef)) {
                setDescription(e.target.value);
              }
            }}
            ref={descriptionRef}
          />
          <p className="edit-modal__input-title"> Password </p>
          <div className="edit-modal__password__container">
            <input
              type="password"
              placeholder={isEditingPassword ? "Nueva contraseña" : "*********"}
              ref={passwordRef}
              readOnly={!isEditingPassword}
              style={{ cursor: isEditingPassword ? "text" : "not-allowed" }}
              value={isEditingPassword ? newPassword ?? "" : ""}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className={`edit-modal__edit-password-btn ${
                isEditingPassword ? "editting" : ""
              }`}
              onClick={handlePasswordEditClick}
              title={
                isEditingPassword ? "Guardar contraseña" : "Editar contraseña"
              }
            >
              <RiEditLine className="edit-modal__edit-icon" />
            </button>
          </div>
          <div className="edit-modal__select-pokemon">
            <p className="edit-modal__fav-pokemon-title"> Pokémon favorito </p>
            <p className="edit-modal__favorite-pokemon-text">{pkmName}</p>
            <div className="fav-pokemon-img-container">
              <img
                src={pkmImg}
                alt="Pokémon favorito"
                className="edit-modal__favorite-pokemon-img"
                onClick={() => setShowModal(true)}
              />
            </div>
          </div>
          <button
            className="edit-modal__save-btn"
            type="submit"
            disabled={loading || !isThereChanges}
            style={{
              cursor: loading || !isThereChanges ? "not-allowed" : "pointer",
            }}
            title={
              loading
                ? "Espera por favor..."
                : !isThereChanges
                ? "No hay cambios para guardar"
                : "Guardar cambios"
            }
          >
            {loading ? <p>Espera por favor...</p> : <p>Guardar</p>}
          </button>
        </form>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowModal(false)}>
              X
            </button>
            <SelectPokemon onSave={handleSavePokemon} />
          </div>
        </div>
      )}
    </div>
  );
}
