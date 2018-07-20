window.WhoisService = function (domain, server, recordType) {
  jQuery.ajax({
    type: 'POST',
    url: '/api',
    data: {domain: domain, server: server, recordType: recordType || 'ANY'},
    success: function (data) {
      var output = '<div id="wrapper"><div class="dig-output">';
      output += data;
      output += '</div></div>';
      jQuery('.whois').empty().append(output);
    }
  });
};
