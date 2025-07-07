import './prescard.css'
import React from 'react';
import {userIcon, emailIcon, githubIcon, linkedInIcon } from '../../assets/about-page/';

interface PresCardProps {
    pkballImg: string;
    username: string;
    github: string;
    email: string;
    linkedIn: string;
    trainerCard: string;
}

const PresCard: React.FC<PresCardProps> = ({ pkballImg, username, github, email, linkedIn, trainerCard}) => {
    return (
        <div className ="pres-card">
            <div className="pres-card__inner">
                <div className="pres-card__front">
                    <div className="pres-card__img-container">
                        <img id="pkball" src={pkballImg} alt="favPokeball" />
                    </div>
                    <div className="pres-card__info">
                        <div className="pres-card__field pres-card__field--name">
                            <img src={userIcon} alt="userIcon" />
                            <span>{username}</span>
                        </div>
                        <div className="pres-card__field pres-card__field--email">
                            <img src={emailIcon} alt="emailIcon" />
                            <span>{email}</span>
                        </div>
                        <div className="pres-card__field pres-card__field--github">
                            <img src={githubIcon} alt="githubIcon" />
                            <span>{github}</span>
                        </div>
                        <div className="pres-card__field pres-card__field--linkedin">
                            <img src={linkedInIcon} alt="linkedInIcon" />
                            <span>{linkedIn}</span>
                        </div>
                    </div>
                </div>
                <div className="pres-card__back">
                    <img id="trainerCard" src={trainerCard} alt="trainerCard" />
                </div>
            </div>
        </div>
    );
}
export default PresCard;