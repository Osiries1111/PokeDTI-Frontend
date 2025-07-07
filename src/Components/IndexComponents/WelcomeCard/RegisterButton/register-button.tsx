import React from "react";
import './register-button.css'
import piplupPixelArt from "../../../../assets/landing-page/piplup-pixelart.png";

interface RegisterButtonProps {

    openRegisterModal: () => void;
}

const RegisterButton: React.FC<RegisterButtonProps> = ( {openRegisterModal} ) => {
    return (
        <button className={"register-button"} onClick={openRegisterModal}>
            <p>
                ¡Regístrate <br/> ahora!
            </p>
            <img src={piplupPixelArt} alt={"piplup"} className={"piplup"}/>
        </button>
    );
}

export default RegisterButton;