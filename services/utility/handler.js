exports.handler = (event, context, callback) => {
    console.log("event ",event);
    console.log("environmentVariables",{ handler: process.env['handler']+"", processId: process.env['processId']+"", tableName: process.env['tableName']+"" });
  callback(null, {message:"Successfully Invoked!", environmentVariables:{handler:process.env['handler'], processId:process.env['processId'], tableName: process.env['apiPrefix']+"",queue1:process.env['queue1']+""}});
};
