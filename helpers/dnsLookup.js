const dns = require("dns");
module.exports = function dnsLookup(server) {
  return new Promise((resolve) => {
    dns.lookup(server, function (error, serverIP) {
      if (error) {
        console.error(`dnsLookup error: ${error}`);
        resolve('8.8.8.8');
        return;
      }
      resolve(serverIP);
    });
  });
}
