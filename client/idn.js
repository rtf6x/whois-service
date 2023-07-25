window.WhoisService = function (domain, server) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api', true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.timeout = 20000;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      var output = '<div id="wrapper"><div class="dig-output">';
      output += xhr.response;
      output += '</div></div>';
      const whoisContainer = document.getElementsByClassName('whois')[0];
      whoisContainer.innerHTML = '';
      whoisContainer.insertAdjacentHTML('afterbegin', output)
    }
  };
  xhr.send(JSON.stringify({
    domain: domain,
    server: server,
    recordType: 'ANY'
  }));
};
