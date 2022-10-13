function app() {
  const movieContainer = document.querySelector(".main-content");
  const inputSearch = document.querySelector(".input-search");

  const config = {
    BASE_URL: "https://api.themoviedb.org/3",
    API_KEY: "100dca56b440928e7d8232f356ca7506",
  };

  const routes = {
    discoverMovie: ({ apiKey = "", sortBy = "popularity.desc", page = 1 }) =>
      `/discover/movie?api_key=${apiKey}&sort_by=${sortBy}&page=${page}}`,
    searchMovie: ({ apiKey = "", page = 1, query = "" }) =>
      `/search/movie?api_key=${apiKey}&query=${query}&page=${page}&language=en-US`,
  };

  const createFigure = async (results) => {
    const figureStr =
      results.length === 0
        ? "Data Movie Tidak Ditemukan"
        : results
            .map(
              (value) => `
      <figure class="figure-movies">
        <img
          class="fig-image"
          src=${
            value.poster_path
              ? `https://image.tmdb.org/t/p/original${value.poster_path}`
              : `./public/assets/images/image-placeholders.png`
          }
          alt="placeholders"
        />
        <figcaption class="fig-caption">
          <div class="fig-header">
            <span class="fig-title">${value.original_title}</span>
            <span class="fig-rating">${value.vote_average}</span>
          </div>
          <div class="release">${new Date(
            value.release_date
          ).toLocaleDateString("en-us", {
            month: "short",
            year: "numeric",
            day: "numeric",
          })}</div>
        </figcaption>
      </figure>
    `
            )
            .join("");
    movieContainer.innerHTML = figureStr;
  };

  const fetcher = async (routes, method = "GET", ...options) => {
    try {
      movieContainer.innerHTML = "Loading...";
      const response = await fetch(config.BASE_URL + routes, {
        ...options,
        method,
      });
      return response.json();
    } catch (err) {
      movieContainer.innerHTML = "Error...";
      console.error(err);
    }
  };

  const init = async () => {
    const response = await fetcher(
      routes.discoverMovie({
        apiKey: config.API_KEY,
      })
    );
    const { results } = response;
    createFigure(results);
  };

  inputSearch.addEventListener("change", async (ev) => {
    if (ev.target.value === "") {
      await init();
    } else {
      const response = await fetcher(
        routes.searchMovie({
          apiKey: config.API_KEY,
          query: ev.target.value,
        })
      );
      const { results } = response;
      createFigure(results);
    }
  });

  init();
}

app();
