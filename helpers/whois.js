const domainInfo = require("domain-info");
module.exports = function whois(domain) {
  return new Promise((resolve) => {
    try {
      domainInfo.whois(domain, (error, data) => {
        if (error) {
          console.error(`domain.whois error: ${error}`);
          resolve('Whois request error');
          return;
        }
        resolve(data);
      });
    } catch (e) {
      resolve('Whois request error');
    }
  });
}
