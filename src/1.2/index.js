const express = require('express');
require('dotenv').config();

const app = express();
const PORT = '3000';

const timeIntervalMsec = process.env.TIME_INTERVAL_SEC * 1000;
const shutdownIntervalMsec = process.env.SHUTDOWN_INTERVAL_SEC * 1000;

const createTimer = (req, res, next) => {
  const startTime = new Date();
  const startTimeInMsec = startTime.getTime();
  const finishtime = startTimeInMsec + shutdownIntervalMsec;
  let counter = startTimeInMsec;

  const timeout = setTimeout(function run () {
    counter = counter + timeIntervalMsec;
    console.log(new Date(counter).toUTCString());
    if (counter > finishtime) {
      res.write(`${new Date(counter).toUTCString()}\n`);
      res.write('END\n');
      res.end();

      return clearTimeout(timeout);
    }

    setTimeout(run, timeIntervalMsec);
  }, timeIntervalMsec);
};

app.get('/date', (req, res, next) => {
  res.setHeader('Content-Type', 'text/html: charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  createTimer(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
