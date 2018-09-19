exports.handler = (event, context, callback) => {

  var responseBody = {message:"some data in string form", event: event, context: context};

  callback(null, responseBody);
};
