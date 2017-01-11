'use strict';

var faker = require('Faker')

exports.handler = (event, context, callback) => {
	var gifs = [];
	for(var i = 0; i < 10; i++) {

		var gif = {};
		gif.id = faker.random.number(100);
		gif.title = faker.Lorem.sentences(1);
		gif.url = faker.Image.imageUrl(100, 100, 'sports') + "?" + faker.random.number(200);

		gifs.push(gif);
	}

	callback(null, gifs);
}