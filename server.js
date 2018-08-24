const http = require('http');
const express = require('express');
const domain = require('domain-info');
const dns = require('dns');
const punycode = require('punycode');
const bodyParser = require('body-parser');
const settings = require('./settings');

const app = express();
const server = http.createServer(app);

app.set('trust proxy', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('morgan')('combined'));

// special api route
app.post('/api', function (req, res) {
  req.body.domain = specialChars(req.body.domain);
  req.body.server = specialChars(req.body.server);
  // req.body.recordType = specialChars(req.body.recordType);
  req.body.domain = punycode.toASCII(req.body.domain);

  var output = '<h2>DNS Records:</h2>';
  if (req.body.server === '') req.body.server = '8.8.8.8';

  dns.lookup(req.body.server, function (err, serverIP) {
    domain.groper(req.body.domain, ['ANY'], {
      type: ['ANY'],
      server: {address: serverIP, port: 53, type: 'udp'},
      timeout: 1000
    }, (error, data) => {
      if (error) {
        console.error(`domain.whois error: ${error}`);
        output += `<div>${error}</div>`;
      } else for (var type in data) {
        for (var record in data[type]) {
          var line = `${data[type][record]['name']}: ${data[type][record]['ttl']} ${type}`;
          if (data[type][record]['data']) line += ` ${data[type][record]['data']}`;
          if (data[type][record]['address']) line += ` ${data[type][record]['address']}`;
          if (data[type][record]['priority']) line += ` ${data[type][record]['priority']}`;
          if (data[type][record]['exchange']) line += ` ${data[type][record]['exchange']}`;
          if (data[type][record]['primary']) line += ` ${data[type][record]['primary']}`;
          if (data[type][record]['admin']) line += ` ${data[type][record]['admin']}`;
          if (data[type][record]['serial']) line += ` ${data[type][record]['serial']}`;
          if (data[type][record]['refresh']) line += ` ${data[type][record]['refresh']}`;
          if (data[type][record]['retry']) line += ` ${data[type][record]['retry']}`;
          if (data[type][record]['expiration']) line += ` ${data[type][record]['expiration']}`;
          if (data[type][record]['minimum']) line += ` ${data[type][record]['minimum']}`;
          output += `<div>${line}</div>`;
        }
      }
      output += '<hr/>';
      output += '<h2>Whois:</h2>';
      domain.whois(req.body.domain, (error, data) => {
        if (error) {
          console.error(`whois error: ${error}`);
          output += `<div>${error}</div>`;
        } else {
          output += data.replace(/([^>])\n/g, '$1<br/>');
        }
        res.send(output);
      });
    });
  });
});

// client
app.use(express.static(__dirname + '/client'));

server.listen(settings.port, 'localhost', function () {
  console.log('listening on localhost:' + settings.port);
});


function specialChars(text) {
  return text.replace(/\0/g, '0').replace(/\\(.)/g, '$1').replace(/&/g, '')
    .replace(/</g, '').replace(/>/g, '').replace(/\\/g, '').replace(/\|/g, '').replace(/\//g, '')
    .replace(/"/g, '').replace(/'/g, '');
}