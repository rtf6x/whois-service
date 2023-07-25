const http = require('http');
const express = require('express');
const punycode = require('punycode');
const bodyParser = require('body-parser');

const settings = require('./settings');

const specialChars = require('./helpers/specialChars');
const dnsLookup = require('./helpers/dnsLookup');
const groper = require('./helpers/groper');
const whois = require('./helpers/whois');

const app = express();
const server = http.createServer(app);

app.set('trust proxy', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('morgan')('combined'));

app.post('/api', async function (req, res) {
  console.log('body', req.body);
  req.body.domain = specialChars(req.body.domain);
  req.body.server = specialChars(req.body.server);
  req.body.domain = punycode.toASCII(req.body.domain);

  var output = '<h2>DNS Records:</h2>';
  if (req.body.server === '') req.body.server = '8.8.8.8';

  let groperData = {};
  let whoisData = '';
  const promises = [
    dnsLookup(req.body.server),
    whois(req.body.domain)
  ];
  try {
    const results = await Promise.all(promises);
    const dnsServerIP = results[0];
    // console.log('dnsServerIP', dnsServerIP);

    groperData = await groper(req.body.domain, dnsServerIP);
    // console.log('groperData', groperData);

    whoisData = results[1];
    // console.log('whoisData', whoisData);
  } catch (e) {
    // console.error('Some of the promises throws an error', e);
    res.send('Error');
    return;
  }

  output += groperData;
  output += '<hr/>';
  output += '<h2>Whois:</h2>';
  output += whoisData.replace(/([^>])\n/g, '$1<br/>');
  res.send(output);
});

// client
app.use(express.static(__dirname + '/client'));

server.listen(settings.port, 'localhost', function () {
  console.log('listening on localhost:' + settings.port);
});
