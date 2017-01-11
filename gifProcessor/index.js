'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
var dynamodb = new aws.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    
    const region = event.Records[0].awsRegion;
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}.`;
            console.log(message);
            callback(message);
        } else {
            //console.log('Data:', data);
            var url = 'https://s3-' + region + '.amazonaws.com/' + bucket + '/' + key;
            //console.log('url:', url);

            var datetime = new Date().getTime().toString();
            var userid = data.Metadata.user_id || "none";

            dynamodb.putItem({
                "TableName": "<TABLE NAME>",
                "Item" : {
                    "key": {"S": key },
                    "date": {"S": datetime },
                    "url": {"S": url },
                    "user_id": {"S": userid }
                }
            }, function(err, data) {
                if (err) {
                    console.log('error', err)
                    callback('Unable to put ' + key + ' item into dynamodb failed: ' + err);
                } else {
                    console.log('Put : '+ JSON.stringify(data, null, '  '));
                    callback(null, 'Put ' + key);
                }
            });
        }
    });
};