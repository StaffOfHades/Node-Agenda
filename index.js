var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var api = require("./api/api.js");
var app = express();

// Serve static content (previously created hmtl files)
app.use("/", express.static(path.join(__dirname, "public")));

// Allows Express to recieve json content and parse it
app.use(bodyParser.json());

// Redirect index to register user
app.get("/", function (req, res) {
   res.redirect("/registrarUsuario.html");
});

api.start(app);
app.listen(3000);
