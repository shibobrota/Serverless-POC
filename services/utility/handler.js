exports.handler = (event, context, callback) => {
    console.log("event ",event);
    console.log("environmentVariables",{ handler: process.env['handler']+"", processId: process.env['processId']+"", tableName: process.env['tableName']+"" });
  callback(null, {event:event, context:context, message:"Successfully Invoked!", environmentVariables:{handler:process.env['handler'], processId:process.env['processId'], tableName: process.env['apiPrefix']+"",p1:process.env['p1']+"",p2:process.env['p2']+"",p3:process.env['p3']+""}});
};
