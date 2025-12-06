const express = require("express");
const bodyParser = require("body-parser");
const dosenControllers = require("./controllers/dosenControllers");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use("/dosen", dosenControllers);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
