exports.handler = (event, context, callback) => {
  
  lambda.invoke({
    FunctionName: 'Serverless-POC-alpha-utility',
    Payload: JSON.stringify({ message:"my data to send"}) // pass params
  }, function(error, data) {
    if (error) {
      callback(error);
    }
    if (data) {
      callback(null, data);
    }
  });  
};
