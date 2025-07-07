import React from 'react';
import {battleFront, diveBall, quickBall, heavyBall, trainerCardFit1, trainerCardFit2, trainerCardFit3} from '../../assets/about-page';
import './about-us.css';
import PresCard from '../../Components/PresCard/prescard';
const AboutUs: React.FC = () => {
    return (
        <div className="about-us">
            <div className="about-us__header-img">
                <img src={battleFront} alt="headerImg" className = "pixelated"/>
            </div>
            <div className="about-us__cards">
                <PresCard
                    pkballImg={diveBall}
                    username="Osiris Diaz"
                    github="Osiries1111"
                    email="ozdiaz@uc.cl"
                    linkedIn="Osiris Diaz"
                    trainerCard={trainerCardFit1}
                />
                <PresCard
                    pkballImg={quickBall}
                    username="Gonzalo Barrueto"
                    github="gbarrueto"
                    email="gbarrueto@uc.cl"
                    linkedIn="Gonzalo Barrueto"
                    trainerCard={trainerCardFit2}
                />
                <PresCard
                    pkballImg={heavyBall}
                    username="Javier Larre  "
                    github="JavierLarre"
                    email="javier.larre@uc.cl"
                    linkedIn="Javier Larre"
                    trainerCard={trainerCardFit3}
                />
            </div>
        </div>
    );
};

export default AboutUs;