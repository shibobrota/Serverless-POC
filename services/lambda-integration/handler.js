const AWS = require('aws-sdk');
/** docClient is for using DynamoDB **/
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' });

exports.handler = (event, context, callback) => {

  var responseBody = {event: event, context: context};
  var date = new Date();
  var params = {
    Item: {
      sessionId: Date.now()+"" ,
      status:"ACTIVE",
      data: {
        event: event, 
        context: context
      }
    },
    TableName: process.env['tableName']
  };

  docClient.put(params, function(error, data) {
    if (error) {
      console.log(error);
      responseBody.message = error;
      callback(null, responseBody);
    }
    else {
      console.log(data);
      responseBody.message = data;
      callback(null, responseBody);
    }
  });
};
