const domainInfo = require("domain-info");
module.exports = function groper(domain, dnsServerIP, types = ['ANY']) {
    return new Promise((resolve) => {
        domainInfo.groper(domain, types, {
            type: types,
            server: {address: dnsServerIP, port: 53, type: 'udp'},
            timeout: 1000
        }, (error, data) => {
            if (error) {
                console.error(`domain.groper error: ${error}`);
                resolve('DNS request error');
                return;
            }
            let output = '';
            for (var type in data) {
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
            resolve(output);
        });
    });
}
