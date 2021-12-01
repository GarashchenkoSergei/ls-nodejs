const express = require('express');

const app = express();
const PORT = '3000';

let connections = [];

app.get('/date', (req, res, next) => {
  res.setHeader('Content-Type', 'text/html: charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  connections.push(res);
});

const timeIntervalMsec = process.argv[2] * 1000;
const shutdownIntervalMsec = process.argv[3] * 1000;

let startTime = new Date();
const startTimeInMsec = startTime.getTime();
const finishtime = startTimeInMsec + shutdownIntervalMsec;
let counter = startTimeInMsec;

setTimeout(function run () {
  counter = counter + timeIntervalMsec;
  console.log(new Date(counter).toUTCString());
  if (counter > finishtime) {
    connections.map(res => {
      res.write('END\n');

      return res.end();
    });
    connections = [];
    startTime = 0;
  }
  connections.map((res, i) => {
    return res.write(`${new Date(counter).toUTCString()}\n`);
  });

  setTimeout(run, timeIntervalMsec);
}, timeIntervalMsec);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
