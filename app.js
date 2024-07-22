document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const loading = document.getElementById('loading');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentPage = 1;
    const limit = 6; // Número de Pokémon por página

    // Event listener para el botón "Anterior"
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchPokemon();
        }
    });

    // Event listener para el botón "Siguiente"
    nextBtn.addEventListener('click', () => {
        currentPage++;
        fetchPokemon();
    });

    // Función para obtener los Pokémon desde la API
    async function fetchPokemon() {
        loading.style.display = 'block'; // Muestra el indicador de carga
        gallery.innerHTML = ''; // Limpia la galería antes de mostrar nuevos datos
        try {
            const offset = (currentPage - 1) * limit;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`); //Realiza la solicitud a la PokeAPI para obtener los datos de los Pokémon.
            if (!response.ok) throw new Error('La respuesta de la red no fue satisfactoria.');
            const data = await response.json();
            for (let pokemon of data.results) {
                const pokemonData = await fetch(pokemon.url).then(res => res.json());
                displayPokemon(pokemonData);
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
            gallery.innerHTML = '<p>Algo salió mal. Por favor, inténtalo de nuevo más tarde.</p>'; 
        } finally {
            loading.style.display = 'none'; // Oculta el indicador de carga
            updateButtons(); // Actualiza el estado de los botones
        }
    }

    // Función para mostrar los Pokémon en la galería
    function displayPokemon(pokemon) {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;

        const name = document.createElement('h2');
        name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        const typeContainer = document.createElement('div');
        typeContainer.classList.add('type');
        pokemon.types.forEach(t => {
            const type = document.createElement('span');
            type.textContent = t.type.name;
            typeContainer.appendChild(type);
        });

        const stats = document.createElement('p');
        stats.textContent = `HP: ${pokemon.stats[0].base_stat} | Ataque: ${pokemon.stats[1].base_stat}`;

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(typeContainer);
        card.appendChild(stats);

        gallery.appendChild(card);
    }

    // Función para actualizar el estado de los botones
    function updateButtons() {
        prevBtn.disabled = currentPage === 1; // Deshabilita el botón "Anterior" en la primera página
        nextBtn.disabled = gallery.childElementCount < limit; // Deshabilita el botón "Siguiente" si no hay suficientes Pokémon en la página actual
    }

    fetchPokemon(); // Carga los Pokémon iniciales
});
