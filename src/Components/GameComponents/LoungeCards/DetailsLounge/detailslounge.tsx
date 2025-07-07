import React, { useState } from "react";
import './detailslounge.css';
import { gastlySpritetwo } from '../../../../assets/find-game-page';

interface DetailsLoungeProps {
    nameUserGame: string;
    imageUserGame: string;
    nameRoom: string;
    totalparticipants: number;
    topic: string;
    placesAval: number;
    onClose: () => void;
    onJoin: () => Promise<void>;
}

const DetailsLounge: React.FC<DetailsLoungeProps> = ({
    nameUserGame,
    imageUserGame,
    nameRoom,
    totalparticipants,
    topic,
    placesAval,
    onClose,
    onJoin
}) => {
    const [showModal, setShowModal] = useState(false);
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        onClose(); // se puede quitar si onClose no es necesario aquí
    };

    const handleJoin = async () => {
        setIsJoiningRoom(true);
        await onJoin().finally(() => setIsJoiningRoom(false));
    };

    return (
        <>
            <div className="resume-details-container">
                <img src={imageUserGame} alt="profile" className="show-resumen-profile" />
                <button onClick={openModal} className="open-modal-button-details">
                    <div className="horizontal-info-container">
                        <div className="name-resumen-details-container">
                            <h2 className="actualy-detail">{nameUserGame}</h2>
                        </div>
                        <div className="places-resumen-details-container">
                            <h2 className="actualy-detail">Cupos: {placesAval}</h2>
                        </div>
                        <img src={gastlySpritetwo} alt="gastly" className="gastly" />
                    </div>
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="details-card-container">
                        <div className="user-data-container">
                            <img src={imageUserGame} alt="profile" className="detail-profile-image" />
                            <h1 className="name-detail">{nameUserGame}</h1>
                            <button className="scape-button-detail" onClick={closeModal}>X</button>
                        </div>
                        <div className="details-of-card-game-container">
                            <div className="info-card-game">
                                <h2>Nombre de la sala</h2>
                                <p className="more-info">{nameRoom}</p>
                            </div>
                            <div className="info-card-game">
                                <h2>Cant. Participantes</h2>
                                <p className="more-info">{totalparticipants}</p>
                            </div>
                            <div className="info-card-game">
                                <h2>Temática</h2>
                                <p className="more-info">{topic}</p>
                            </div>
                            <div className="info-card-game">
                                <h2>Cupos Disponibles</h2>
                                <p className="more-info">{placesAval}</p>
                            </div>
                        </div>
                        <button className="join-button" onClick={handleJoin} disabled={isJoiningRoom}>
                            {isJoiningRoom ? "Uniéndose..." : "Unirse"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailsLounge;
