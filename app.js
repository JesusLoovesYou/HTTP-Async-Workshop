/* globals console require setTimeout Promise */
'use strict';

const httpRequester = require("./utils/http-requester");
const htmlParser = require("./utils/html-parser");
const htmlDetailedMovieParser = require("./utils/html-parser-detailed");
const queuesFactory = require("./data-structures/queue");
const modelsFactory = require("./models");
const constants = require("./config/constants");
//*************
const SimpleMovie = require("./models/simple-movie-model");

require("./config/mongoose")(constants.connectionString);

let urlsQueue = queuesFactory.getQueue();

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

constants.genres.forEach(genre => {
    for (let i = 0; i < constants.pagesCount; i += 1) {
        let url = `http://www.imdb.com/search/title?genres=${genre}&title_type=feature&0sort=moviemeter,asc&page=${i + 1}&view=simple&ref_=adv_nxt`;
        urlsQueue.push(url);
    }
});

function getMoviesFromUrl(url) {
    console.log(`Working with ${url}`);
    httpRequester.get(url)
        .then((result) => {
            const selector = ".col-title span[title] a";
            const html = result.body;
            return htmlParser.parseSimpleMovie(selector, html);
        })
        .then(movies => {
            let dbMovies = movies.map(movie => {
                return modelsFactory.getSimpleMovie(movie.title, movie.url);
            });

            modelsFactory.insertManySimpleMovies(dbMovies);

            return wait(1000);
        })
        .then(() => {
            if (urlsQueue.isEmpty()) {
                return;
            }

            getMoviesFromUrl(urlsQueue.pop());
        })
        .catch((err) => {
            console.dir(err, { colors: true });
        });
}

function parseHref(href) {
    return 'http://www.imdb.com' + href;
}

function parseTitle(href, html) {
    return html.split("&nbsp;")[0];
}

function parseHtml(href, html) {
    return html;
}

function parseDate(href, html) {
    let sDate = html.split("Date:</h4>")[1];
    let index = sDate.indexOf("<");
    sDate = sDate.substring(0, index).split("(")[0].trim();
    return new Date(sDate);
}

function getDetailedMoviesFromUrlById(imdbId) {
    console.log(`Working with detailed movie ${imdbId}`);

    //const url = 'http://www.imdb.com/title/${imdbId}/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=2495768522&pf_rd_r=1CS87QBS7W60MRC6JFS0&pf_rd_s=right-7&pf_rd_t=15061&pf_rd_i=homepage&ref_=hm_cht_t0';
    const url = `http://www.imdb.com/title/${imdbId}`;

    httpRequester.get(url)
        .then((result) => {
            let selectors = [];
            selectors.push({ name: 'poster', selector: '.poster a', parse: parseHref }); //poster
            selectors.push({ name: 'trailer', selector: '.slate a', parse: parseHref }); //trailer
            selectors.push({ name: 'title', selector: '.title_wrapper h1', parse: parseTitle }); //title
            selectors.push({ name: 'description', selector: '#titleStoryLine [itemprop="description"] p', parse: parseHtml }); //description/storyline
            selectors.push({ name: 'categories', selector: 'a [itemprop="genre"]', parse: parseHtml }); //categories/genres (a list)
            selectors.push({ name: 'releaseDate', selector: '#titleDetails.article', parse: parseDate }); //release date //TODO
            selectors.push({ name: 'listOfActors', selector: '#titleCast tr .itemprop [itemprop="name"]', parse: parseHtml }); //actors

            const html = result.body;
            // console.log("html:" + html);

            return htmlDetailedMovieParser.parseDetailedMovie(selectors, html);
        })
        .then(DetailedMovieInfo => {
            let coverImage = DetailedMovieInfo["poster"];
            let trailer = DetailedMovieInfo["trailer"][0];
            let title = DetailedMovieInfo["title"][0];
            let description = DetailedMovieInfo["description"][0];
            let categories = DetailedMovieInfo["categories"];
            let releaseDate = DetailedMovieInfo["releaseDate"][0];
            let listOfActors = DetailedMovieInfo["listOfActors"];
            /*
            console.log("poster:" + coverImage);
            console.log("trailer:" + trailer);
            console.log("title:" + title);
            console.log("description:" + description);
            console.log("categories:" + categories);
            console.log("releaseDate:" + releaseDate);
            console.log("listOfActors:" + listOfActors);
            */
            let record = modelsFactory.getDetailedMovie({ imdbId, coverImage, trailer, title, description, categories, releaseDate, listOfActors });

            modelsFactory.insertManyDetailedMovies(record);
            console.log("Done");
            return wait(100);
        })

        .catch((err) => {
            console.dir(err, { colors: true });
        });
}

const asyncPagesCount = 1; //15;

//Array.from({ length: asyncPagesCount }).forEach(() => getMoviesFromUrl(urlsQueue.pop()));
//getDetailedMoviesFromUrlById('tt1211837');
/*for (let i = 0; i < 10; i += 1) {
    getDetailedMoviesFromUrlById('tt2064968');
}*/

SimpleMovie.find({}, function (err, movies) {
    if (err) throw err;
    //let movie = movies[0];
    for (var movie of movies) {
        getDetailedMoviesFromUrlById(movie.imdbId);
        console.log('ready' + movie);
    }
});
