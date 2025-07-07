import React from "react"
import "./user-info-card.css"
import RibbonBox from "./RibbonBox/ribbon-box";


import type { RibbonClass } from "../ribbon-types";


import { mewSprite, shinyMewSprite } from "../../../assets/perfil-page";
import { useRequireAuth } from "../../../auth/useRequireAuth";


interface UserInfoCardProps {
    adquiredRibbons: Array<[RibbonClass, number]>;

}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ adquiredRibbons }) => {

    // Obtener current user del contexto de autenticación
    const auth = useRequireAuth(false);
    const { currentUser } = auth;
    if (!currentUser) return null;

    return (
        <div className="user-info-card">
            <div className="user-info-card__header">
                <div className="user-info-card__header img-container">
                    <img src={mewSprite} alt="Mew" className="user-info-card__header-img mew" />
                </div>
                <div className="user-info-card__header username-container">
                    <h2 className="user-info-card__username">{currentUser?.username}</h2>
                </div>
                <div className="user-info-card__header img-container">
                    <img src={shinyMewSprite} alt="Mew Shiny" className="user-info-card__header-img shiny-mew" />
                </div>
            </div>
            <div className="user-info-card__body">
                <div className="user-info-card__inner-body-container">
                    <div className="user-info-card__description-section">
                        <div className="user-info-card__description-title">
                            <h3 className="user-info-card__description-title-text">Descripción</h3>
                        </div>
                        <div className="user-info-card__description-content">
                            <p className="user-info-card__description-text">{currentUser?.profileDescription || "¡Escribe algo sobre ti!"}</p>
                        </div>
                    </div>
                    <div className="user-info-card__ribbons-container">
                        <div className="user-info-card__ribbons-title">
                            <h3 className="user-info-card__ribbons-title-text">Cintas</h3>
                        </div>
                        <RibbonBox adquiredRibbons={adquiredRibbons} />
                    </div>
                </div>
                <div className="user-info-card__body-footer">
                    <p className="user-info-card__body-footer-text">¡Gracias por visitar mi perfil!</p>
                </div>
            </div>
        </div>
    );
};

export default UserInfoCard;