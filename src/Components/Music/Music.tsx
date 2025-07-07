import React, { useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  src: string; // Ruta del archivo de audio :)
}

const Music: React.FC<BackgroundMusicProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playMusic = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          console.warn('Autoplay bloqueado por el navegador:', err);
        });
      }
    };

    window.addEventListener('click', playMusic, { once: true });

    return () => {
      window.removeEventListener('click', playMusic);
    };
  }, []);

  return (
    <audio ref={audioRef} loop>
      <source src={src} type="audio/mpeg" />
      Tu navegador no soporta audio.
    </audio>
  );
};

export default Music;
