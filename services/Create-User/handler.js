const AWS = require('aws-sdk');
var lambda = new AWS.Lambda({region: 'ap-south-1'});
exports.handler = (event, context, callback) => {

var responseBody = JSON.parse(event.body);
responseBody.message +=" New Addition."
  var response = {
      "statusCode": 200,
      "headers": {
        "my_Sample_header": "value"
      },
      "body": JSON.stringify(responseBody),
      "isBase64Encoded": false
  };
  lambda.invoke({

    FunctionName: 'Serverless-POC-alpha-utility',
    Payload: JSON.stringify({ message:"my data to send"}) // pass params

  }, function(error, data) {
    if (error) {
      response.body = JSON.stringify(error);
      response.statusCode = 500;
      callback(response);
    }
    if (data) {
      response.body = JSON.stringify(data);
      callback(null, response);
    }
  }); 
};
