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
        required: false
    },

    coverImage: {
        type: [String],
        required: false
    },

    trailer: {
        type: String,
        required: false //stays that way
    },

    title: {
        type: String,
        required: false
    },

    description: {
        type: String,
        required: false
    },

    categories: {
        type: [String],
        required: false
    },

    releaseDate: {
        type: Date,
        required: false
    },

    listOfActors: {
        type: [movieActorSchema],
        required: false
    }

    //nestedDocuments: {
    //  type: [String],
    //required: true
    //}


});

//At least one cover image (its link)
//Optional trailer (its link), if one is available
//Title
//Description/Storyline
//Categories (Genres)
//Release date
//List of actors
//Nested documents
//Have name of the role in the movie, name, id in IMDB and profile image (its link)

//  /title/tt0067992/?ref_=adv_li_tt

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