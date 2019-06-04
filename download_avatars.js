var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');
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

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function(err) {
           throw err;
         // })
         // .on('response', function(response) {
         //   console.log('Response Status Code: ', response.statusCode);
         })
         .pipe(fs.createWriteStream(filePath));
}

//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  for (contributor of result) {
    downloadImageByURL(contributor.avatar_url, 'avatars/' + contributor.login + '.png');
  }
});