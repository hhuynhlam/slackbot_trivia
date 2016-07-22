var http = require('http');

var JSERVICE_RANDOM_QUESTION = 'http://jservice.io/api/random'

var formatQuestion = function(response) {
  return response.category.title + ': ' + response.question;
}

module.exports = function(robot) {
  robot.hear(/tell anhtuan no/i, function(res) {
    res.send('No Anhtuan, just no.');
  });

  robot.hear(/tell steve no/i, function(res) {
    res.send('Hell no, Steve!');
  });

  robot.hear(/trivia question/i, function(res) {
    http.get(JSERVICE_RANDOM_QUESTION, function(response) {
      responseText = '';

      response.on('data', function (chunk) {
        return responseText += chunk;
      });

      response.on('end', function() {
        responseJson = JSON.parse(responseText)[0];

        if (!responseJson) { return; }

        res.send(formatQuestion(responseJson));

        robot.brain.set('jservice.answer', responseJson.answer);
      });
    });
  });

  robot.hear(/trivia answer/i, function(res) {
    res.send(robot.brain.get('jservice.answer'));
  });
}
