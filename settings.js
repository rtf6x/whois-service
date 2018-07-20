const fs = require('fs');

let settings = {
  port: 8060,
};

if (fs.existsSync(__dirname + '/settings.local.js')) {
  settings = Object.assign(settings, require(__dirname + '/settings.local.js'));
}

module.exports = settings;
