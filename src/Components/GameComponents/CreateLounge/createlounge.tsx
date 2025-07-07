import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createlounge.css";
import { pikachuDressed, porygonSprite } from "../../../assets/others-sprites";
import { useRequireAuth } from "../../../auth/useRequireAuth";
import { apiUrl } from "../../../config/consts";
import axios from "axios";
// Modal para crear una sala de juego
const CreateLounge: React.FC = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [participants, setParticipants] = useState("");
  const [topic, setTopic] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  // Navigation

  const navigate = useNavigate();

  // Auth
  const { currentUser, token } = useRequireAuth();

  // Modal control functions

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Handle functions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsCreatingRoom(true);
    setIsJoiningRoom(false);

    try {
      const response = await axios.post(
        `${apiUrl}/lobbies`,
        {
          name: roomName,
          maxPlayers: parseInt(participants, 10),
          theme: topic,
          hostId: currentUser?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Sala creada:", response.data);

      setIsCreatingRoom(false);
      setIsJoiningRoom(true);

      try {
        const lobbyId = response.data.id;
        const joinResponse = await axios.post(
          `${apiUrl}/userinlobby/${currentUser?.id}`,
          {
            lobbyId: lobbyId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Unido a la sala:", joinResponse.data);
        navigate(`/lobby/${lobbyId}`)
      } catch (joinError) {
        console.error("Error al unirse a la sala:", joinError);
        alert(
          "Error al unirse a la sala. Por favor, inténtalo de nuevo."
        );
      } finally {
        setIsJoiningRoom(false);
      }
    } catch (error) {
      console.error("Error al crear la sala:", error);
      setIsCreatingRoom(false);
      alert("Error al crear la sala. Por favor, inténtalo de nuevo.");
    }

    closeModal();
  };

  return (
    <>
      <button onClick={openModal} className="open-modal-button">
        Crear
        <img src={porygonSprite} alt="porygon" className="porygon" />
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="create-lounge-container">
            <button className="out-button-crete-lounge" onClick={closeModal}>
              X
            </button>
            <div className="title-room-up">
              <h1>Crear una sala</h1>
            </div>
            <img
              src={pikachuDressed}
              alt="pikachu-vestido"
              className="pikachu-create-sala"
            />
            <form onSubmit={handleSubmit} className="form-create-room">
              <label className="lounge-name-title-input">Nombre de sala</label>
              <input
                type="text"
                minLength={3}
                maxLength={20}
                className="lounge-name-input"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />

              <label className="lounge-participants-title-input">
                Participantes
              </label>
              <input
                type="number"
                className="lounge-participants-input"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                required
                min={2}
                max={10}
              />

              <label className="lounge-tema-title-input">Elige un tema</label>
              <input
                type="text"
                minLength={3}
                maxLength={50}
                className="lounge-tema-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isCreatingRoom || isJoiningRoom}
                className="create-room-button"
              >
                {isCreatingRoom
                  ? "Creando sala..."
                  : isJoiningRoom
                  ? "Uniéndose..."
                  : "Crear sala"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateLounge;
