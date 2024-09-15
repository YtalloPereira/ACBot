const cors = require('cors');
const express = require('express')
const index = require('./lambda/index.js')
const app = express()
const port = 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.post('/data', async (req, res) => {
  const response = await index.handler(req.body);
  res.send(response);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});