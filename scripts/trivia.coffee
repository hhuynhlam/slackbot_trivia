http = require 'http'

JSERVICE_RANDOM_QUESTION = 'http://jservice.io/api/random'

formatQuestion = (questionResponse) ->
  "#{questionResponse.category.title}: #{questionResponse.question}"

module.exports = (robot) ->
  robot.hear /trivia question/i, (res) ->
    http.get JSERVICE_RANDOM_QUESTION, (response) ->
      responseText = ''

      response.on 'data', (chunk) ->
        responseText += chunk

      response.on 'end', () ->
        responseJson = JSON.parse(responseText)[0]

        return unless responseJson

        res.send formatQuestion(responseJson)
        robot.brain.set 'jservice.answer', responseJson.answer

  robot.hear /trivia answer/i, (res) ->
    res.send robot.brain.get 'jservice.answer'
