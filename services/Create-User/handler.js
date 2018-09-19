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
  callback(null, response);
};
