const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({
    name: "Himanshu sharma",
    Email: "himanshush@gmail.com"
  });
});

const port = process.env.PORT || 5000;
app.listen(port, err => {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
});
