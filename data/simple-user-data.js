const SimpleMovie = require("../models/simple-movie-model");

function findByName(name) {
    const promise = new Promise((resolve, reject) => {
        SimpleMovie.find({ name: new RegExp(name, "i") }, (err, response) => {
            if (err) {
                return reject(err);
            }

            return resolve(response);
        });
    });

    return promise;
}

function findPage(page, pageSize) {
    const promise = new Promise((resolve, reject) => {
        SimpleMovie.find({})
            .skip(page * pageSize)
            .limit(pageSize)
            .exec((err, response) => {
                if (err) {
                    return reject(err);
                }

                return resolve(response);
            });
    });

    return promise;
}

module.exports = {
    findByName,
    findPage
};