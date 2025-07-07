import React, { useState } from 'react';
import { voltorbSprite } from '../../assets/others-sprites';
import './reportbutton.css';
import { apiUrl } from '../../config/consts';
import axios from 'axios';
import { useRequireAuth } from '../../auth/useRequireAuth';

interface Out {
    idUserReport: number;
    idUserReported: number;
}

const ReportButton: React.FC<Out> = ({ idUserReport, idUserReported }) => {
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState('');

    const { token } = useRequireAuth();

    const handleButton = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setComment('');
    };

    const handleSubmit = async () => {

        if (!comment.trim()) {
            alert('Por favor, escribe un comentario antes de enviar el reporte.');
            return;
        }

        try {
            await axios.post(`${apiUrl}/userinlobby/${idUserReport}/reports/${idUserReported}`, {
                reason: comment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });

            alert('Reporte enviado exitosamente.');
            handleClose();
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 404) {
                    alert('Uno o ambos usuarios no existen.');
                } else if (error.response && error.response.status === 403) {
                    alert('No tienes permiso para realizar esta acción.');
                } else {
                    alert('Error al enviar el reporte. Por favor, inténtalo de nuevo más tarde.');
                }
            } else {
                console.error('Error desconocido al enviar el reporte:', error);
                alert('Error desconocido al enviar el reporte. Por favor, inténtalo de nuevo más tarde.');
            }
        }
    };

    return (
        <>
            <div className='container-out-button'>
                <button onClick={handleButton}>
                    Reportar
                    <img src={voltorbSprite} alt="sprite-voltorb" />
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>¿Por qué deseas reportar?</h2>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Escribe tu comentario..."
                        />
                        <div className="modal-buttons">
                            <button className="submit" onClick={handleSubmit}>Enviar</button>
                            <button className="cancel" onClick={handleClose}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReportButton;
