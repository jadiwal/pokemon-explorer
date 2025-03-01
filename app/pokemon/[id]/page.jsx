'use client';

import React, { useState, useEffect, use } from 'react'
import { useParams } from 'next/navigation';

function Page({ params }) {
    const { id } = use(params);

    const [loading, setLoading] = useState(true);
    const [pokemon, setPokemon] = useState(null);

    // console.log(id, "id")
    useEffect(() => {
        async function fetchPokemon() {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                if (!res.ok) throw new Error('Failed to fetch Pokemon details');
                const data = await res.json();
                
                setPokemon({
                    name: data.name,
                    image: data.sprites.other['official-artwork'].front_default,
                    abilities: data.abilities.map((a) => a.ability.name),
                    types: data.types.map((t) => t.type.name),
                    stats: data.stats.map((s) => ({
                        name: s.stat.name,
                        value: s.base_stat,
                    })),
                    moves: data.moves.slice(0, 5).map((m) => m.move.name), 
                });
            } catch (error) {
                console.error('Error fetching Pokemon details:', error);
            }finally {
                setLoading(false); // Set loading to false after fetch completes
            }
        }
        fetchPokemon();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
        );
    }


    if (!pokemon) {
        return <div className="text-center mt-10 text-red-500">Failed to load Pokemon details</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4 capitalize">{pokemon.name}</h1>
            <img src={pokemon.image} alt={pokemon.name} className="w-48 h-48 mb-4" />

            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-2">Abilities</h2>
                <p>{pokemon.abilities.join(', ')}</p>

                <h2 className="text-2xl font-semibold mt-4 mb-2">Types</h2>
                <p>{pokemon.types.join(', ')}</p>

                <h2 className="text-2xl font-semibold mt-4 mb-2">Stats</h2>
                <ul>
                    {pokemon.stats.map((stat) => (
                        <li key={stat.name} className="flex justify-between">
                            <span>{stat.name}</span>
                            <span className="font-bold">{stat.value}</span>
                        </li>
                    ))}
                </ul>

                <h2 className="text-2xl font-semibold mt-4 mb-2">Moves</h2>
                <p>{pokemon.moves.join(', ')}</p>
            </div>
        </div>
    )
}

export default Page
