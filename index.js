var express = require("express");
var path = require("path");
var app = express();

app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", function (req, res) {
   res.render("registrarUsuario");
});
app.get("/horario.html", function (req, res) {
   res.render("horario");
});
app.get("/agregarActividad.html", function (req, res) {
   res.render("agregarActividad");
});
app.get("/registrarUsuario.html", function (req, res) {
   res.redirect("/");
});

app.listen(3000);
