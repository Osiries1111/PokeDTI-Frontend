import React, { useEffect, useState } from "react";
import "./selectpokemon.css";
import { missigno } from '../../assets/lobby-page';

interface Props {
    onSave: (pokemonImage: string, pokedex: number, pokemonName?: string) => void;
}

const SelectPokemon: React.FC<Props> = ({ onSave }) => {
    const [pokemonList, setPokemonList] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPokemon, setSelectedPokemon] = useState("");
    const [pokemonImage, setPokemonImage] = useState(missigno);
    const [NumPoke, setNumPoke] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
                const data = await response.json();
                type PokemonResult = { name: string; url: string };
                setPokemonList((data.results as PokemonResult[]).map((p) => p.name));
            } catch (error) {
                console.error("Error fetching Pokémon list:", error);
            }
        };
        fetchPokemonList();
    }, []);

    useEffect(() => {
        if (!selectedPokemon) return;
        const fetchImage = async () => {
            setLoading(true); // Empieza a cargar
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`);
                const data = await res.json();
                setPokemonImage(data.sprites.front_default);
                setNumPoke(data.id);
            } catch (error) {
                console.error("Error fetching Pokémon image:", error);
                setPokemonImage(missigno);
                setNumPoke(0);
            } finally {
                setLoading(false); // Termina de cargar
            }
        };
        fetchImage();
    }, [selectedPokemon]);


    const handleGuardar = () => {
        if (pokemonImage) {
            onSave(pokemonImage, NumPoke, selectedPokemon); // Envía el sprite y num de pokedex al componente padre
        }
    };

    const filtered = pokemonList.filter(p =>
        p.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="select-pokemon-modal">
            <h2>Selecciona un Pokémon</h2>
            <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                value={selectedPokemon}
                onChange={(e) => setSelectedPokemon(e.target.value)}
            >
                <option value="">Selecciona un Pokémon</option>
                {filtered.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                ))}
            </select>

            {loading ? (
                <div>
                    <span>Cargando...</span>
                </div>
            ) : (
                pokemonImage && <img src={pokemonImage} alt="preview" className="preview-image" />
            )}

            <button onClick={handleGuardar}>Guardar</button>
        </div>
    );
};

export default SelectPokemon;
