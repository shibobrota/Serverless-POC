exports.handler = (event, context, callback) => {

  var responseBody = {body:"some data in string form", statusCode:409, event: event, context: context};

  callback(null, responseBody);
};
