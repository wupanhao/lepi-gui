function getUrlParam(name) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair.length < 2) {
      return
    }
    if (pair[0] == name) {
      return pair[1];
    }
  }
  return (false);
}

module.exports = {
  getUrlParam: getUrlParam
}