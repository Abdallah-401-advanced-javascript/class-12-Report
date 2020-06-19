'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// Esoteric Resources
const oath = require('./linkedin.js');

// Prepare the express app
const app = express();
app.use(express.json()); // body
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('./public'));

// Routes
app.get('/oauth', oath, (req, res)=> {
  return res.status(200).send(req.token);
});

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
