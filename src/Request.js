const API_KEY = "17d596d57df7238c6383a505bbdf7215";
const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_network=213`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}`,
  fetchActionMovies: `/movie/top_rated?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/movie/top_rated?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/movie/top_rated?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/movie/top_rated?api_key=${API_KEY}&with_genres=10749`,
  // fetchActionandAdventure: `/movie/top_rated?api_key=${API_KEY}&with_genres=10759`,
};
export default requests;
