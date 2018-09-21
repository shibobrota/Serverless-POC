const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.handler = (event, context, callback) => {

  var responseBody = {message:"some data in string form", event: event, context: context};

  var params = {
      DelaySeconds: 0,
      MessageBody: JSON.stringify(responseBody),
      QueueUrl: process.env.sqsURL
  };

  sqs.sendMessage(params, function(err, data) {
      if (err) {
          console.log('error:' + err, null);
          var responseObj = new Object();
          responseObj.message = "SQS Error.";
          responseObj.error = err;
          callback(null, responseObj);
      }
      else {
          console.log('data:', data.MessageId);
          callback(null, data);
      }
  });
};
