exports.handler = (event, context, callback) => {

  var responseBody = {event: event, context: context};
  console.log("RESPONSE: ",JSON.stringify(responseBody));
  callback(null, "OK");
};
