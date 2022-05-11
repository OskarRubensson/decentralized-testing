const express = require("express");
const path = require("path");
const app = express();
const port = 5500;

app.use(express.json());

app.use(express.static(__dirname + "/public"));
app.use(express.static("."));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});