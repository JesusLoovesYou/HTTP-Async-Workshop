/* globals module require Promise */
"use strict";

const jsdom = require("jsdom").jsdom,
    doc = jsdom(),
    window = doc.defaultView,
    $ = require("jquery")(window);

module.exports.parseDetailedMovie = (selectorArray, html) => {
    $("body").html(html);

    let items = {};
    for (let selectorObj of selectorArray) {
        var item= [];
        $(selectorObj.selector).each((index, detInfo) => {
            const $detInfo = $(detInfo);
            let info = selectorObj.parse($detInfo.attr("href"),$detInfo.html());
            item.push(info);
            /*item.push({
                html: $detInfo.html(),
                href: $detInfo.attr("href")
            });*/
        });
        items[selectorObj.name]=item;
    };

    return Promise.resolve()
        .then(() => {
            return items;
        });
};