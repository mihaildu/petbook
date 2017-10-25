var express = require("express");
var app = express();

app.set("port", (process.env.PORT || 5000));
app.use(express.static(__dirname + "/public"));

app.get("/", function(request, response) {
    var file_path = __dirname + "/views/index.html";
    response.sendFile(file_path);
});

app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
