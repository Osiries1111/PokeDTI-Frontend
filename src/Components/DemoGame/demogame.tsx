import React, { forwardRef, useImperativeHandle ,useEffect, useRef, useState } from "react";
import './demogame.css';
import axios from "axios";
import { apiUrl } from "../../config/consts";
import {
  accesorios,
  backgroundPokemon,
  trashSprite,
  flecha,
} from "../../assets/dress-page";
import { missigno } from "../../assets/lobby-page";

interface Accessory {
  id: number;
  src: string;
  x: number;
  y: number;
}

interface DemoGameProps {
  pokedexId: number;
  id_demo: boolean;
  token: string;
  currentUserId: number;
}

export interface DemoGameHandle {
  generateImageAndUpload: () => Promise<void>;
}

const DemoGame = forwardRef<DemoGameHandle | null, DemoGameProps>(
  ({ pokedexId, id_demo, token, currentUserId }, ref) => {
  const [showAcc, setShowAcc] = useState(0);
  const [spriteUrl, setSpriteUrl] = useState<string>(missigno);
  const [placedAccessories, setPlacedAccessories] = useState<Accessory[]>([]);
  const idCounter = useRef(0);

  const trashRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      async generateImageAndUpload() {
        if (!canvasRef.current || !currentUserId) return;

        await drawToCanvas();

        const dataUrl = canvasRef.current.toDataURL("image/png");

        // Convertir a Blob
        const blob = await (await fetch(dataUrl)).blob();

        // Crear FormData
        const formData = new FormData();
        formData.append("file", blob, "pokemon-vestido.png");

        try {
          const response = await axios.post(`${apiUrl}/images/upload-dress/${currentUserId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          console.log("Imagen subida correctamente:", response.data);
        } catch (error) {
          console.error("Error al subir la imagen:", error);
        }
      },
    }),
    [spriteUrl, placedAccessories, token, currentUserId]
  );



    useEffect(() => {
    const fetchSprite = async () => {
      if (!pokedexId || pokedexId <= 0) {
        return;
      }
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexId}`);
        const data = await res.json();
        const base64Sprite = await fetchImageAsBase64(data.sprites.front_default);
        setSpriteUrl(base64Sprite); // esto evitará el taint del canvas
      } catch (err) {
        console.error("Error fetching sprite:", err);
      }
    };

    fetchSprite();
  }, [pokedexId]);

  const fetchImageAsBase64 = async (url: string): Promise<string> => {

    const res = await fetch(url);
    const blob = await res.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleLeftClick = () => {
    setShowAcc((prev) => Math.max(prev - 1, 0));
  };

  const handleRightClick = () => {
    setShowAcc((prev) => Math.min(prev + 1, accesorios.length - 6));
  };

  // Al iniciar arrastre de accesorio nuevo (desde la lista)
  const handleDragStartNew = (
    e: React.DragEvent<HTMLImageElement>,
    src: string
  ) => {
    e.dataTransfer.setData("type", "new");
    e.dataTransfer.setData("accessorySrc", src);
  };

  // Al iniciar arrastre de accesorio ya colocado
  const handleAccessoryDragStart = (
  e: React.DragEvent<HTMLImageElement>,
  id: number
) => {
  e.dataTransfer.setData("type", "existing");
  e.dataTransfer.setData("accessoryId", id.toString());

  // Usa una imagen temporal como imagen de arrastre
  const img = new Image();
  img.src = e.currentTarget.src;
  img.width = 50;
  img.height = 50;

  // Un pequeño retraso para asegurar que esté cargada
  img.onload = () => {
    e.dataTransfer.setDragImage(img, 25, 25);
  };
};


  // Cuando se suelta accesorio sobre el Pokémon
  const handleDropOnPokemon = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - 25;
    const y = e.clientY - rect.top - 25;

    if (type === "new") {
      const src = e.dataTransfer.getData("accessorySrc");
      setPlacedAccessories((prev) => [
        ...prev,
        { id: idCounter.current++, src, x, y },
      ]);
    } else if (type === "existing") {
      // Actualiza posición del accesorio movido
      const id = Number(e.dataTransfer.getData("accessoryId"));
      setPlacedAccessories((prev) =>
        prev.map((acc) => (acc.id === id ? { ...acc, x, y } : acc))
      );
    }
  };

  // Permitir soltar accesorio
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Cuando termina arrastre de accesorio colocado, verificar si se tira en basura
  const handleAccessoryDragEnd = (
    e: React.DragEvent<HTMLImageElement>,
    id: number
  ) => {
    const trash = trashRef.current?.getBoundingClientRect();
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    if (
      trash &&
      e.clientX >= trash.left &&
      e.clientX <= trash.right &&
      e.clientY >= trash.top &&
      e.clientY <= trash.bottom
    ) {
      // Si lo soltó en la basura, eliminarlo
      setPlacedAccessories((prev) => prev.filter((acc) => acc.id !== id));
    } else {
      // Si lo soltó en otro lado del contenedor pero NO en basura, actualizar posición
      const x = e.clientX - container.left - 25;
      const y = e.clientY - container.top - 25;

      setPlacedAccessories((prev) =>
        prev.map((acc) => (acc.id === id ? { ...acc, x, y } : acc))
      );
    }
  };

  // Función para dibujar Pokémon y accesorios en canvas para exportar (sin fondo)
  const drawToCanvas = async () => {
  if (!canvasRef.current || !containerRef.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pokemonElement = document.getElementById("dragonita-pokemon-sprite");
  if (!pokemonElement) return;

  const pokemonRect = pokemonElement.getBoundingClientRect();
  const containerRect = containerRef.current.getBoundingClientRect();

  // Medidas reales del Pokémon en pantalla
  const screenPokemonWidth = pokemonRect.width;
  const screenPokemonHeight = pokemonRect.height;

  // Posición relativa del Pokémon respecto al contenedor
  const screenOffsetX = pokemonRect.left - containerRect.left;
  const screenOffsetY = pokemonRect.top - containerRect.top;

  const pokemonImg = new Image();
  pokemonImg.src = spriteUrl;
  await new Promise((res) => (pokemonImg.onload = res));

  // Centramos al Pokémon dentro del canvas
  const canvasPokemonX = (canvas.width - screenPokemonWidth) / 2;
  const canvasPokemonY = (canvas.height - screenPokemonHeight) / 2;

  // Dibujar Pokémon en su tamaño real
  ctx.drawImage(pokemonImg, canvasPokemonX, canvasPokemonY, screenPokemonWidth, screenPokemonHeight);

  // Dibujar accesorios en las posiciones relativas
  for (const acc of placedAccessories) {
    const accImg = new Image();
    accImg.src = acc.src;
    await new Promise((res) => (accImg.onload = res));

    const maxSize = 50;
    const scale = Math.min(maxSize / accImg.width, maxSize / accImg.height);
    const drawWidth = accImg.width * scale;
    const drawHeight = accImg.height * scale;

    // Ajustamos posición para coincidir con Pokémon en canvas
    const adjustedX = acc.x - screenOffsetX + canvasPokemonX;
    const adjustedY = acc.y - screenOffsetY + canvasPokemonY;

    ctx.drawImage(accImg, adjustedX, adjustedY, drawWidth, drawHeight);
  }
};


  const handleExportTransparentImage = async () => {
    await drawToCanvas();
    if (!canvasRef.current) return;

    const dataURL = canvasRef.current.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "pokemon-vestido.png";
    link.click();
  };



  return (
    <div className="demo">
      <div className="take-pass-accesories-container">
        <button onClick={handleLeftClick}>
          <img src={flecha} alt="←" style={{ width: "100%" }} />
        </button>

        <div className="accesories-container" style={{overflowX: "auto"}}>
          {accesorios.slice(showAcc, showAcc + 6).map((src, idx) => (
            <img
              key={showAcc + idx}
              src={src}
              alt={`Accesorio ${showAcc + idx}`}
              draggable
              onDragStart={(e) => handleDragStartNew(e, src)}
              className="accessory-image"
              onContextMenu={(e) => e.preventDefault()}
            />

          ))}
        </div>

        <button onClick={handleRightClick}>
          <img src={flecha} alt="→" style={{ transform: "rotate(180deg)" , width: "100%"}}/>
        </button>
      </div>
      <div className="pokemon-container-wrapper">
          <div
        className="pokemon-dressed-demo-container"
        ref={containerRef}
        onDrop={handleDropOnPokemon}
        onDragOver={handleDragOver}
        style={{
          backgroundImage: `url(${backgroundPokemon})`,
        }}
      >
        <img src={spriteUrl} alt="Dragonite" id="dragonita-pokemon-sprite" className="pokemon-sprite" />

        {placedAccessories.map((acc) => (
          <img
            key={acc.id}
            src={acc.src}
            draggable
            onDragStart={(e) => handleAccessoryDragStart(e, acc.id)}
            onDragEnd={(e) => handleAccessoryDragEnd(e, acc.id)}
            className="placed-accessory"
            style={{
              position: "absolute",
              left: acc.x,
              top: acc.y,
              cursor: "move",
            }}
          />
        ))}

        
      </div>

        <img ref={trashRef} src={trashSprite} alt="Trash" id="trash"/>
      </div>
      
      

      <canvas ref={canvasRef} width={500} height={500} style={{ display: "none" }} />

      { id_demo && (
        <button onClick={handleExportTransparentImage} className="export-button">
          Guardar Pokémon vestido (sin fondo)
        </button>
      )}

    </div>
  );
});

export default DemoGame;