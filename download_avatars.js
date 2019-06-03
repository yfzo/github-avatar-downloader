var request = require('request');
var secrets = require('./secrets');
//var fs = require('fs');
console.log('Welcome to the GitHub Avatar Downloader!');

// var owner = process.argv[2];
// var repo = process.argv[3];

function getRepoContributors (repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'Token ' + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      var data = JSON.parse(body);

      cb(err, data);
    }
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  for (contributor of result) {
   console.log("Avatar url:", contributor.avatar_url);
  }
});