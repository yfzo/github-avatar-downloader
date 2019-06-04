var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');

var owner = process.argv[2];
var repo = process.argv[3];

function getRepoContributors (repoOwner, repoName, cb) {

  //terminates and logs error message if either owner or repo not supplied
  try{
    if (!repoOwner || !repoName) throw "Missing repository owner or name argument";
  }
  catch(err) {
    console.log(err);
  }

  //sets options for request
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'Token ' + secrets.GITHUB_TOKEN
    }
  };

  //gets data and passes the array of contributor objs to cb
  request(options, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      var data = JSON.parse(body);

      cb(err, data);
    }
  });
}

//downloads image from given url and saves to filePath
function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function(err) {
           throw err;
         })
         .pipe(fs.createWriteStream(filePath));
}

console.log('Welcome to the GitHub Avatar Downloader!');

//connects and passes data from request to downloadImageByURL
getRepoContributors(owner, repo, function(err, result) {
  console.log("Errors:", err);

  for (contributor of result) {
    downloadImageByURL(contributor.avatar_url, 'avatars/' + contributor.login + '.png');
  }
});