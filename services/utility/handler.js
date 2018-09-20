exports.handler = (event, context, callback) => {
    console.log("event ",event);
    console.log("environmentVariables",{ handler: process.env['handler']+"", processId: process.env['processId']+"" });
  callback(null, {message:"Successfully Invoked!", environmentVariables:{handler:process.env['handler'], processId:process.env['processId']}});
};
