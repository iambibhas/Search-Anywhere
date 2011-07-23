var c = localStorage["engine_count"];
chrome.extension.sendRequest({count: c}, function(response) {
  console.log(response.msg);
});