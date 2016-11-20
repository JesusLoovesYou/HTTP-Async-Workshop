/* global module require */ 

module.exports.parseActors = (html) => {
    $('body').html(html);
    let selector = "div#titleCast table.cast_list tr";

    const actors = [];
    $(selector).each((index, item) => {
        if (index === 0) {
            return;
        }

        const row = $(item);

        const parsedName = row.find('td[itemprop="actor"] span').text(),
            parsedCharacter = $(row.find('td.character div a')[0]).text(),
            parsedImdbId = getActorIdmbIdFromHref(row.find('td[itemprop="actor"] a').attr('href')),
            parsedImage = row.find('td.primary_photo a').attr('href');

        const actor = {
            name: parsedName,
            character: parsedCharacter,
            imdbId: parsedImdbId,
            image: parsedImage
        };

        actors.push(actor);
    });

};

// /name/nm7368158/?ref_=tt_cl_i1
function getActorIdmbIdFromHref(href) {
    if (!href) {
        return "";
    }

    const words = href.split('/');
    return words[2];
}



