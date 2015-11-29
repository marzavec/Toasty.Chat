function Client() {

}
Client.prototype.initialize = function (config) {
  this.config = config;
};

Client.prototype.run = function () {
  console.log("Started client on " + this.config.host + ":" + this.config.port);
  var express = require('express');
  var app = express();
  var fs = require('fs');
  try{
  fs.mkdirSync(__dirname + "/client/schemes");
  }
  catch(e){
    console.log(e);
  }
  var less = require('less');
  var files = fs.readdirSync(__dirname + "/client/base16");
  files.forEach(function (file) {
    var lessFile = fs.readFileSync(__dirname + "/client/scheme.less");
    less.render(lessFile.toString(), {
      paths:["./client"],
      globalVars:{name:file.replace(/\.less/i,"")}
    }, function (e, output) {
      fs.writeFileSync(__dirname + "/client/schemes/"+ file.replace(/less$/i,"css"), output.css);
    });
  });
  less.render(fs.readFileSync(__dirname + "/client/style.less").toString(), function (e, output) {
    fs.writeFileSync(__dirname + "/client/style.css", output.css);
  });
  app.set('views', __dirname + '/client');
  app.set("view engine", "jade");
  app.use(express.static(__dirname + '/client'));
  app.use("/schemes",express.static(__dirname + '/client/schemes'));
  app.get("/", function (req, res) {
    res.render("index");
  });

  app.listen(this.config.port);
};

module.exports = function(){
  return new Client();
}
