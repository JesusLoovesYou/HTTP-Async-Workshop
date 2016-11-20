/* globals require module */
"use strict";

const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const movieActorSchema = new Schema({
    profileImage: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    biography: {
        type: String
    },
    movies: []
});

const DetailedMovieSchema = new Schema({
    /*   name: {
        type: String,
        required: false
    },
*/
    imdbId: {
        type: String,
        required: true
    },

    coverImage: {
        type: [String],
        required: true
    },

    trailer: {
        type: String,
        required: false //stays that way
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    categories: {
        type: [String],
        required: true
    },

    releaseDate: {
        type: Date,
        required: true
    },

    listOfActors: {
<<<<<<< HEAD
        type: [movieActorSchema],
        required: false
=======
        type: [String],
        required: true
>>>>>>> origin/master
    }

    //nestedDocuments: {
    //  type: [String],
    //required: true
    //}


});

let DetailedMovie;
DetailedMovieSchema.statics.getDetailedMovieByNameAndUrl =
    function(detailedInfo) {
        return new DetailedMovie(detailedInfo);
    };

DetailedMovieSchema.virtual.imdbUrl = function() {
    return `http://imdb.com/title/${this.imdbId}/?ref_=adv_li_tt`;
};

mongoose.model("DetailedMovie", DetailedMovieSchema);
DetailedMovie = mongoose.model("DetailedMovie");
module.exports = DetailedMovie;