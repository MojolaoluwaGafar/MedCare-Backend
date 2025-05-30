const express = require("express");
const app = express();

app.get("/test", (req, res) => {
  res.send("Server is working!");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🟢 Test server running on port ${PORT}`);
});
