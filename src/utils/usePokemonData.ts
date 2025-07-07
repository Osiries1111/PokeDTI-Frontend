import { useEffect, useState } from "react";
import axios from "axios";

export interface PokemonData {
  spriteUrl: string;
  pkmName: string;
}

const cacheName = "pokeapi-cache";

const fetchPokemonDataById = async (favoritePokemonId: number): Promise<PokemonData> => {
  if (!favoritePokemonId || favoritePokemonId <= 0) {
    return { spriteUrl: "", pkmName: "" };
  }

  const cacheKey = `pokeapi-pokemon-${favoritePokemonId}`;
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(cacheKey);

  if (cachedResponse) {
    try {
      const data = await cachedResponse.json();
      const spriteUrl = data.sprites?.front_default ?? "";
      const pkmName = data.species?.name ?? "";
      return { spriteUrl, pkmName };
    } catch (e) {
      console.log("Error al leer la caché:", e);
    }
  }

  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${favoritePokemonId}`);
    const spriteUrl = res.data.sprites.front_default ?? "";
    const pkmName = res.data.species.name ?? "";
    // Guarda en caché
    cache.put(
      cacheKey,
      new Response(JSON.stringify(res.data), {
        headers: { "Content-Type": "application/json" },
      })
    );
    return { spriteUrl, pkmName };
  } catch (error) {
    console.error("No se pudo obtener el Pokémon:", error);
    return { spriteUrl: "", pkmName: "" };
  }
};

export function usePokemonData(favoritePokemonId: number | null | undefined) {
  const [spriteUrl, setSpriteUrl] = useState<string>("");
  const [pkmName, setPkmName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!favoritePokemonId || favoritePokemonId <= 0) {
      setSpriteUrl("");
      setPkmName("");
      return;
    }
    setLoading(true);

    fetchPokemonDataById(favoritePokemonId)
      .then(({ spriteUrl, pkmName }) => {
        if (isMounted) {
          setSpriteUrl(spriteUrl);
          setPkmName(pkmName);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [favoritePokemonId]);

  return { spriteUrl, pkmName, loading };
}