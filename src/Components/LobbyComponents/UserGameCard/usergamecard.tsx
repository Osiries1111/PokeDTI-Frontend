import React, { useState, useEffect, useRef } from "react";
import "./usergamecard.css";
import {
  kickflag,
  missigno,
  optionsSprite,
} from "../../../assets/lobby-page/index.ts";
import SelectPokemon from "../../SelectPokemon/selectpokemon.tsx";
import { useRequireAuth } from "../../../auth/useRequireAuth.ts";
import { apiUrl } from "../../../config/consts.ts";
import axios from "axios";
import { Socket } from "socket.io-client";

interface UserData {
  owner_id: number;
  roomId: number;
  thisCardUserInLobbyId: number;
  thisCardUserId: number;
  currentUserId: number;
  nameUserGame: string;
  imageUserGame: string;
  imageliston: string;
  id_pokemon: number;
  socket: Socket | null;
  currentRoomName: string;
  currentRoomMaxParticipants: number;
  currentRoomTheme: string;
}

const UserGameCard: React.FC<UserData> = ({
  owner_id,
  roomId,
  thisCardUserInLobbyId,
  thisCardUserId,
  currentUserId,
  nameUserGame,
  imageUserGame,
  imageliston,
  id_pokemon,
  socket,
  currentRoomName,
  currentRoomMaxParticipants,
  currentRoomTheme,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [Pokemon, setPokemon] = useState(missigno);
  const isCardUserOwner = owner_id === thisCardUserId;
  const isCurrentUserOwner = owner_id === currentUserId;
  const isCurrentUserCard = currentUserId === thisCardUserId;

  const { token } = useRequireAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [roomName, setRoomName] = useState(currentRoomName || "");
  const [participants, setParticipants] = useState(currentRoomMaxParticipants || 2);
  const [theme, setTheme] = useState(currentRoomTheme || "");

  useEffect(() => {
    if (id_pokemon && id_pokemon > 0) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${id_pokemon}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener el Pokémon");
          return res.json();
        })
        .then((data) => {
          const spriteUrl = data.sprites.front_default;
          if (spriteUrl) {
            setPokemon(spriteUrl);
          }
        })
        .catch((err) => {
          console.error("No se pudo obtener el Pokémon:", err);
        });
    }
  }, [id_pokemon]);

  // Escucha los eventos del socket para actualizar el Pokémon de la tarjeta
  useEffect(() => {
    if (!thisCardUserId || !socket) return;

    const handler = (data: {
      userInLobbyId: number;
      choosenPokemon: number;
      pokemonImage: string;
    }) => {
      if (data.userInLobbyId === thisCardUserInLobbyId) {
        setPokemon(data.pokemonImage);
      }
    };

    socket.on("updateCardPokemon", handler);

    return () => {
      socket.off("updateCardPokemon", handler);
    };
  }, [thisCardUserInLobbyId, thisCardUserId, socket]);
  const handleKickUser = async () => {
    // Aquí puedes implementar la lógica para expulsar al usuario
    if (
      window.confirm("¿Estás seguro de que quieres expulsar a este usuario?")
    ) {
      await axios
        .patch(
          `${apiUrl}/userinlobby/leave/${thisCardUserInLobbyId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          socket?.emit("kickUser", {
            userId: thisCardUserId,
            roomId: roomId,
          });
          console.log("Usuario expulsado correctamente");
        })
        .catch((error) => {
          console.error("Error al expulsar al usuario:", error);
          alert("No se pudo expulsar al usuario.");
        });
    }
  };

  const handleSavePokemon = (pokemonImage: string, pokedex: number) => {
    // setPokemon(pokemonImage);
    // setNumPoke(pokedex);

    if (!isCurrentUserCard) return;

    try {
      axios.patch(
        `${apiUrl}/userinlobby/${thisCardUserInLobbyId}`,
        {
          choosenPokemon: pokedex,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socket?.emit("updatePokemon", {
        userInLobbyId: thisCardUserInLobbyId,
        choosenPokemon: pokedex,
        pokemonImage: pokemonImage,
        lobbyId: roomId,
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar el Pokémon:", error);
    }
  };

  // Abre el modal
  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  // Cierra el modal
  const closeDialog = () => {
    dialogRef.current?.close();
  };

  // Maneja el submit del formulario
  const handleRoomEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${apiUrl}/lobbies/${roomId}`,
        {
          name: roomName,
          maxPlayers: participants,
          theme: theme,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Emitir evento de actualización de sala

      socket?.emit("updateRoomData", {
        lobbyId: roomId
      });

      closeDialog();
      alert("Sala actualizada correctamente");
    } catch (error) {
      alert("No se pudo actualizar la sala");
      console.error(error);
    }
  };

  return (
    <div className="container-card-game-user">
      <div className="profile-game-lobby-container">
        <img
          src={imageUserGame || missigno}
          alt="perfil-image"
          className="profile-pic"
        />
      </div>

      <div className="text-container">
        <h2 style={{ color: isCurrentUserCard ? "red" : "black" }}>
          {nameUserGame}
        </h2>
        {isCardUserOwner && <h3>owner</h3>}
      </div>

      {/* Botón opciones o bandera */}
      {isCurrentUserOwner && (
        <div className="item button-item">
          {isCurrentUserCard ? (
            <button className="buttonoptions" onClick={openDialog}>
              <img src={optionsSprite} alt="options" className="imageoption" />
            </button>
          ) : (
            <button className="buttonflag">
              <img
                src={kickflag}
                alt="flag"
                className="imageflag"
                onClick={handleKickUser}
              />
            </button>
          )}
        </div>
      )}

      {/* Listón */}
      <div className="item button-item">
        <img src={imageliston} alt="image-liston" className="imageliston" />
      </div>

      {/* Botón seleccionar Pokémon */}
      <div className="item button-item">
        {isCurrentUserCard ? (
          <button
            className="button-select-pokemon"
            onClick={() => setShowModal(true)}
          >
            <img
              src={Pokemon}
              alt="pokemon-sprite"
              className="pokemon-select-for-game"
            />
          </button>
        ) : (
          <img
            src={Pokemon}
            alt="pokemon-sprite"
            className="pokemon-select-for-game"
          />
        )}
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

      {/* Dialog para editar sala */}
      { isCardUserOwner && 
      <dialog className="edit-lobby-dialog" ref={dialogRef}>
        <form className="edit-lobby-form" onSubmit={handleRoomEdit} method="dialog">
          <h3 className="edit-lobby-title" >Editar Sala</h3>
          <label>
            Nombre sala:
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              minLength={3}
              maxLength={20}
            />
          </label>
          <br />
          <label>
            Cantidad de participantes:
            <input
              type="number"
              value={participants}
              min={2}
              max={10}
              onChange={(e) => setParticipants(Number(e.target.value))}
              required
            />
          </label>
          <br />
          <label>
            Tema:
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              required
              minLength={3}
              maxLength={20}
            />
          </label>
          <br />
          <button type="submit">Guardar</button>
          <button type="button" onClick={closeDialog}>
            Cancelar
          </button>
        </form>
      </dialog>}
    </div>
  );
};

export default UserGameCard;
