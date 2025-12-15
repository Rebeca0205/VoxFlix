const generos = {
  adventure: {
    query: "adventure",
    label: "Adventure"
  },
  horror: {
    query: "horror",
    label: "Horror"
  },
  romance: {
    query: "romance",
    label: "Romance"
  },
  comedy: {
    query: "comedy",
    label: "Comedy"
  },
  western: {
    query: "western",
    label: "Western"
  }
};

const createShowCard = (show) => {
    const card = document.createElement("div");
    card.classList.add("poster");

    const image = document.createElement("img");
    image.src = show.image.medium;
    image.alt = show.name;

    const name = document.createElement("h3");
    name.textContent = show.name;

    card.appendChild(image);

    card.appendChild(name);
    

    return card;
};

const loadShowsCarousel = async (genreKey) => {
    const genre = generos[genreKey];
    const container = document.getElementById(`${genreKey}`);
    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${genre.query}`);
        const shows = response.data
            .map(item => item.show)
            .filter(show => 
            show.image &&
            show.genres.includes(genre.label)
        )
        .slice(0, 7);

        shows.forEach(show => {
            const card = createShowCard(show);
            container.appendChild(card);
        });


    } catch (error){
        console.log("Error de fetch: ", error)
    }
}

Object.keys(generos).forEach(genreKey => {
  loadShowsCarousel(genreKey);
});

const searchShow = async () => {
    const showName = document.getElementById('searchSection__searchInput').value.toLowerCase();
    if(showName){
        try{
            const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${showName}`);
            const searchSection = document.getElementById('searchSpace');
            const searchGrid = document.getElementById('searchGrid');
            searchGrid.innerHTML = '';
            const shows = response.data
                .map(item => item.show)
                .filter(show => show)
                .slice(0, 7); // ajusta cuantos quieres

            if (!shows.length) {
                searchGrid.innerHTML = `<p class="error">No encontré resultados para "${showName}".</p>`;
                return;
            }

            searchSection.classList.remove('hidden');

            shows.forEach(show => {
                searchGrid.appendChild(createShowCard(show));
            });

            

        } catch(error){
            console.log("Error al buscar show: ", error)
        }
    }
}

document.getElementById('searchSection__icon').addEventListener('click', searchShow);
document.getElementById('searchSection__searchInput').addEventListener('keypress', function(e){
    if(e.key == 'Enter'){
        searchShow();
    }
})
