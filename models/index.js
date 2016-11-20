/* globals module require */

const SimpleMovie = require("./simple-movie-model");
const DetailedMovie = require("./detailed-movie-model");

module.exports = {
    getSimpleMovie(name, url) {
        return SimpleMovie.getSimpleMovieByNameAndUrl(name, url);
    },

     getDetailedMovie(detailedInfo) {
        return DetailedMovie.getDetailedMovieByNameAndUrl(detailedInfo);
    },

    insertManySimpleMovies(movies) {
        SimpleMovie.insertMany(movies);
    },

    insertManyDetailedMovies(detailedInfo) {
        DetailedMovie.insertMany([detailedInfo]);
    }
};