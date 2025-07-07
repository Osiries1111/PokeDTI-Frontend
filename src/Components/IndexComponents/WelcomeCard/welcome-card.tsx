import React, { useEffect } from "react";
import './welcome-card.css';
import RegisterButton from "./RegisterButton/register-button.tsx";
import axios from "axios";
import { apiUrl } from "../../../config/consts.ts";

interface WelcomeCardProps {
    openRegisterModal: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ openRegisterModal }) => {
    const [userCount, setUserCount] = React.useState<number>(0);
    
    useEffect(() => {

        axios.get(`${apiUrl}/users/count`)
            .then((response) => {
                setUserCount(response.data.count);
            })
            .catch((error) => {
                console.error("Error fetching user count:", error);
            });
        }, []);

    return (
        <div className={"welcome-card"}>
            <div className="welcome-card__title-container">
                <h1>
                    ¡Bienvenido a pokeDTI!
                </h1>
            </div>
            <div className="welcome-card__body-container">
                <p>
                    En <b>pokeDTI</b> cada concurso es una pasarela y cada Pokemon es tu modelo estrella.
                </p>
                <p>
                    Concursa junto a tu Pokemon y compite en el escenario contra los otros <b>{userCount}</b> entrenadores de PokeDTI.
                </p>
                <p>
                    ¡Demuéstrales que eres el entrenador con más estilo!
                </p>
            </div>
            <div className="welcome-card__btn-container">
                <RegisterButton openRegisterModal={openRegisterModal} />
            </div>
        </div>
    );
}

export default WelcomeCard;