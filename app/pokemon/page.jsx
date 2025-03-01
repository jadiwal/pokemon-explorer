"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  async function fetchPokemons() {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();

      if (data.results) {
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokeRes = await fetch(pokemon.url);
            const pokeData = await pokeRes.json();
            return {
              name: pokemon.name,
              image: pokeData.sprites.front_default,
              id: pokeData.id,
            };
          })
        );
        setPokemons(pokemonDetails);
      } else {
        setPokemons([]);
      }
    } catch (error) {
      console.error('Error fetching Pokemons:', error);
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  }


  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setMounted(true);
    fetchPokemons();
  }, []);

  // Detect system dark mode
  useEffect(() => {
    setMounted(true);
    fetchPokemons();

    const checkSystemTheme = () => {
      const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(darkMode);
    };

    checkSystemTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkSystemTheme);

    return () => mediaQuery.removeEventListener("change", checkSystemTheme);
  }, []);
  if (!mounted) {
    return null;
  }


   
  return (
    <div className={`min-h-screen p-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>

    <h1 className={`text-3xl font-bold text-center mb-4 ${isDarkMode ? "text-white" : "text-black"}`}>
      Pokemon Explorer
    </h1>
  
    <div className="text-center">
      <input
        type="text"
        placeholder="Search Pokemon..."
        className={`w-[320px] p-2 mb-4 border rounded ${isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  
    {loading ? (
      <div className="flex justify-center items-center my-10">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    ) : filteredPokemons.length > 0 ? (

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPokemons.map((pokemon) => (
          <Link
            key={pokemon.id}
            href={`/pokemon/${pokemon.id}`}
            className={`p-4 shadow rounded text-center ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            <img src={pokemon.image} alt={pokemon.name} className="w-24 h-24 mx-auto" />
            <p className="mt-2 font-bold">{pokemon.name.toUpperCase()}</p>
          </Link>
        ))}
      </div>
    ) : (
      <div className={`text-center mt-10 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        No Pokemons found
      </div>
    )}
  </div>
  
  );
}
