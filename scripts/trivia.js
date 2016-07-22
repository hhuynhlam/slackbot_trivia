var http = require('http');

var JSERVICE_RANDOM_QUESTION = 'http://jservice.io/api/random'

var formatQuestion = function(response) {
  return response.category.title + ': ' + response.question;
}

module.exports = function(robot) {
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
