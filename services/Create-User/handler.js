exports.handler = (event, context, callback) => {

  var responseBody = {requestBody:event.body};

  var response = {
      "statusCode": 200,
      "headers": {
          "my_header": "my_value"
      },
      "body": JSON.stringify(responseBody),
      "isBase64Encoded": false
  };
  callback(null, response);
};
