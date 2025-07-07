import React from 'react';
import { textBox } from '../../assets/others';
import './rules.css';
import backgroundOras from "../../assets/landing-page/background-oras.png"
import DemoGame from '../../Components/DemoGame/demogame';

const Rules: React.FC = () => {
    const backgroundStyle = { backgroundImage: `url(${backgroundOras})` };
    return (
        <div className="rules-container" style={backgroundStyle}>
            <div className="title-box">
                <h1 className="up-title">Reglas</h1>
                <img src={textBox} alt="textBox-rules" className="textBox-rules" />
            </div>
            <div className="accordions">
                <details className="boxes-rules">
                    <summary className="title-rules">¿Cómo Jugar?</summary>

                    <details className='box-detail-rules'>
                        <summary className='title-detail-sub-rule'>1. Crea una Cuenta</summary>
                        <ol>
                            <li>Si ya tienes una cuenta ve al paso 2.</li>
                            <li>Busca el botón de "¡Regístrate Ahora!"</li>
                            <li>Ingresa los datos que te solicitamos.</li>
                            <li>¡Y listo! Así de fácil es. Ahora ve al paso 2 para poder jugar.</li>
                        </ol>
                    </details>

                    <details className='box-detail-rules'>
                        <summary className='title-detail-sub-rule'>2. Busca o Crea una Sala</summary>
                        <ol>
                            <li>Pulsa el botón "Game" para buscar o crear una sala.</li>
                            <li>Si deseas crear una sala, pulsa "Crear" y completa los datos solicitados.</li>
                            <li>Si creaste una sala, serás el anfitrión.</li>
                        </ol>
                    </details>

                    <details className='box-detail-rules'>
                        <summary className='title-detail-sub-rule'>3. Únete a una Sala</summary>
                        <ol>
                            <li>Para unirte a una sala, busca una que tenga cupos disponibles.</li>
                            <li>Haz clic en la sala para ver más información sobre ella.</li>
                            <li>Si todo está bien y te gusta la temática, pulsa "Unirte".</li>
                        </ol>
                    </details>

                    <details className='box-detail-rules'>
                        <summary className='title-detail-sub-rule'>4. Elige a tu Pokémon</summary>
                        <ol>
                            <li>Dentro de la sala, elige a tu Pokémon para el concurso.</li>
                            <li>Una vez elegido, estarás en el lobby.</li>
                            <li>En caso de que desees retirarte, solo pulsa el botón de "Salir".</li>
                        </ol>
                    </details>

                    <details className='box-detail-rules'>
                        <summary className='title-detail-sub-rule'>5. Espera que la Sala se Llene</summary>
                        <ol>
                            <li>Si eres el creador de la sala, serás el anfitrión y podrás expulsar jugadores.</li>
                            <li>Si no eres anfitrión, espera a que la sala se llene.</li>
                            <li>Una vez que la sala se llene, comenzará la partida.</li>
                            <li>En caso de que desees retirarte, solo pulsa el botón de "Salir".</li>
                        </ol>
                    </details>

                    <details className='box-detail-rules'>
                        <summary className='title-detail-sub-rule'>6. Viste a tu Pokémon</summary>
                        <ol>
                            <li>Ahora deberás vestir a tu Pokémon según el tema.</li>
                            <li>Para vestirlo, arrastra los accesorios sobre el Pokémon (¡rápido, tienes poco tiempo!).</li>
                            <li>Para quitar un accesorio, arrástralo al basurero.</li>
                            <li>Cuando termines, pulsa el botón "Terminar".</li>
                            <li>En caso de que desees retirarte, solo pulsa el botón de "Salir".</li>
                        </ol>
                        <p>¡Prueba esta demo que hicimos para ti!</p>
                        <DemoGame pokedexId={149} id_demo={true} token={" "} currentUserId={-1} />
                        
                    </details>

                    <details className='box-detail-rules'>
                        <summary className='title-detail-sub-rule'>7. Vota por tus Pokémon Preferidos</summary>
                        <ol>
                            <li>Vota por el Pokémon con más estilo y que respete mejor el tema.</li>
                            <li>Haz clic en "like" o "dislike" para emitir tu voto.</li>
                            <li>Una vez hayas votado por todos, espera a que los demás terminen para ver los ganadores.</li>
                            <li>En caso de que desees retirarte, solo pulsa el botón de "Salir".</li>
                        </ol>
                    </details>

                    <details className='box-detail-rules'>
                        <summary className='title-detail-sub-rule'>8. Los Ganadores</summary>
                        <ol>
                            <li>El Pokémon con más "likes" será el ganador.</li>
                            <li>Cuando termines de ver los ganadores, pulsa el botón de "Salir".</li>
                            <li>¡Y vuelve a jugar cuantas veces quieras!</li>
                        </ol>
                    </details>
                </details>

                <details className="boxes-rules">
                    <summary className="title-rules">Reglas</summary>
                    <div className='secundary-container-rules'>
                        <ul>
                            <li>Para hacer uso del juego requieres tener una cuenta en esta página</li>
                            <li>Viste a tu Pokémon de acuerdo al tema propuesto.</li>
                            <li>Evita atuendos ofensivos o sugerentes para otros usuarios.</li>
                            <li>Ser reportado puede causar la suspensión o eliminación de tu cuenta.</li>
                            <li>Los ganadores se eligen por votación.</li>
                            <li>El Pokémon con más "likes" ganará el concurso.</li>
                        </ul>
                    </div>
                </details>

                <details className="boxes-rules">
                    <summary className="title-rules">Reportar Jugador</summary>
                    <div className='secundary-container-rules'>
                        <ol>
                            <li>Haz clic en el botón "Reportar".</li>
                            <li>Describe el motivo del reporte en el cuadro de texto.</li>
                            <li>Pulsa el botón "Enviar".</li>
                            <li>La solicitud será revisada por el equipo de desarrollo.</li>
                            <li>Si procede, la cuenta del jugador reportado será eliminada.</li>
                        </ol>
                    </div>
                </details>
            </div>

            
        </div>
    );
};

export default Rules;
