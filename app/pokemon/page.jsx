"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();

        if (data.results) {
          // console.log(data.results)
          const pokemonDetails = await Promise.all(
            data?.results?.map(async (pokemon) => {
              const pokeRes = await fetch(pokemon.url);
              const pokeData = await pokeRes.json();
              return {
                name: pokemon?.name,
                image: pokeData?.sprites?.front_default,
                id: pokeData?.id,
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
      }
    }
    fetchPokemons();
  }, []);

  if (!pokemons.length) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

//   const handleEdit = data => {
//     router.push(`/home/${data.id}`)
// }
console.log(filteredPokemons, "filteredPokemons")
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Pokemon Explorer</h1>
     <div className='text-center'>
      <input
          type="text"
          placeholder="Search Pokemon..."
          className="w-[320px] p-2 mb-4 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
     </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPokemons.map((pokemon) => (
          <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`} className="p-4 bg-white shadow rounded text-center">
            <img src={pokemon.image} alt={pokemon.name} className="w-24 h-24 mx-auto" />
            <p className="mt-2 font-bold">{pokemon.name.toUpperCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
