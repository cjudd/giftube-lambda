'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
var dynamodb = new aws.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {

	var params = {
		TableName: "<TABLE NAME",
	}

	dynamodb.scan(params, (err, data) => {
		var gifs = [];

console.log("data: " + JSON.stringify(data, null, '  '));

		data.Items.forEach((item) => {

console.log("item: " + JSON.stringify(item, null, '  '));
console.log("key:" + JSON.stringify(item.key, null, '  '));

			var gif = {};
			gif.id = item.key.S;
			gif.title = item.user_id.S + "-" + item.date.S;
			gif.url = item.url.S;

			gifs.push(gif);

		});

		callback(null, gifs);

	});
}