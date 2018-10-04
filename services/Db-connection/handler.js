const mysql = require('mysql');
exports.handler = (event, context, callback) => {
  console.log("event",event);
  var connection = mysql.createConnection({
    host: process.env.host,
    user: 'user',
    password: process.env.password,
    port: process.env.port,
    database: process.env.database,
    debug: false
  });
  connection.query("select * from userAccount;", function (error, results, fields) {
    if (error) {
        console.log("Errorrrrr");
        connection.destroy();
        callback(error,error);
    } else {
        // connected!
        console.log(results, "results");
        connection.destroy();
        var resp = { DbResp: results, message: "Yey!! It is WORKING" }
        callback(null, resp);
    }
  });
};
