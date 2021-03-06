import React, { useState, useEffect } from "react";
import Cell from "./components/cell/Cell_Exp";
import { getPokemon, getAllPokemon } from "./data/data";
import "./App.css";
import Navbar from "./components/navbar/navbar";

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonDataCopy, setPokemonDataCopy] = useState([]); // Für Search!
  const [prevNextVisibility, setPrevNextVisibility] = useState(true); // Für Search!
  const [loading, setLoading] = useState(true);
  const initialURL = "https://pokeapi.co/api/v2/pokemon?limit=50";
  const allPokemonURL = "https://pokeapi.co/api/v2/pokemon?limit=807"; // Für Search!
  const [prevURL, setPrevURL] = useState("");
  const [nextURL, setNextURL] = useState("");
  const [searchResponse, setSearchRespones] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialURL);

      // Für Search!
      let response2 = await getAllPokemon(allPokemonURL);
      await response2.results.forEach((pokemon) => {
        var id = pokemon.url.replace("https://pokeapi.co/api/v2/pokemon/", "");
        pokemon["id"] = id.replace("/", "");
      });
      setSearchRespones(response2);

      setNextURL(response.next);
      setPrevURL(response.previous);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonRecord = await getPokemon(pokemon);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
    setPokemonDataCopy(_pokemonData); // Für Search !
  };

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  const prev = async () => {
    if (!prevURL) return;
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  // Resultset of found Pokemon for the given search criteria gets
  // loaded into pokemonData
  function handleChange(newPokemonData) {
    setPokemonData(newPokemonData);
  }
  function handleLoading(loadingState) {
    setLoading(loadingState);
  }
  function handlePrevNext(isVisible) {
    setPrevNextVisibility(isVisible);
  }

  return (
    <>
      <Navbar
        searchResponse={searchResponse}
        pokemonData={pokemonDataCopy}
        loading={loading}
        onChange={handleChange}
        onLoading={handleLoading}
        prevNextVisibility={handlePrevNext}
      />
      <div>
        {loading ? (
          <h1 style={{ textAlign: "center", color: "white" }}>Loading...</h1>
        ) : (
          <>
            <div className="grid-container">
              {pokemonData.map((pokemon, i) => {
                return <Cell key={i} pokemon={pokemon} />;
              })}
            </div>
            {prevNextVisibility ? (
              <div className="btn-field">
                <button className={"btn-l"} onClick={prev}>
                  ←
                </button>
                <button className={"btn-r"} onClick={next}>
                  →
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
      <footer>
        <p id={"foot"}>
          Based on <a href={"https://pokeapi.co/"}>PokéAPI</a> &{" "}
          <a href={"https://www.pokemon.com/us/pokedex/"}>Pokémon</a>
        </p>
      </footer>
    </>
  );
}

export default App;
