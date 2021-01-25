const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5000;

app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`server is up at ${port}`);
  return;
})
