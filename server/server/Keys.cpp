#include "pch.h"
#include "Keys.h"

/* Login */
const char* Keys::username = "username";
const char* Keys::password = "password";
const char* Keys::email = "email";


/* Rooms */

//Requests
const char* Keys::roomName = "roomName";
const char* Keys::questionCount = "questionCount";
const char* Keys::maxPlayers = "maxPlayers";
const char* Keys::timePerQuestion = "timePerQuestion";
const char* Keys::questionsCount = "questionsCount";

//Responses
const char* Keys::rooms = "rooms";
const char* Keys::playersInRoom = "playersInRoom";
const char* Keys::roomId = "roomId";
const char* Keys::currentPlayerCount = "currentPlayerCount";
const char* Keys::roomStatus = "roomStatus";


/* Game */

//Requests
const char* Keys::answerIndex = "answerIndex";
const char* Keys::answerTime = "answerTime";

//Responses
const char* Keys::category = "category";
const char* Keys::difficulty = "difficulty";
const char* Keys::question = "question";
const char* Keys::answers = "answers";
const char* Keys::correctAnswerIndex = "correctAnswerIndex";
const char* Keys::playersResults = "playersResults";


/* Statistics */
const char* Keys::numPoints = "numPoints";
const char* Keys::numTotalGames = "numTotalGames";
const char* Keys::numCorrectAnswers = "numCorrectAnswers";
const char* Keys::numWrongAnswers = "numWrongAnswers";
const char* Keys::averageAnswerTime = "averageAnswerTime";
const char* Keys::highScores = "highScores";


/* Error Response */
const char* Keys::message = "message";