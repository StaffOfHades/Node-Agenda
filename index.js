var express = require("express");
var path = require("path");
var app = express();

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
   res.redirect("/registrarUsuario.html");
});

app.listen(3000);
