#pragma once

struct Keys
{
	/* Login */
	static const char* username;
	static const char* password;
	static const char* email;
	

	/* Room */

	//Requests
	static const char* roomName;
	static const char* questionCount;
	static const char* maxPlayers;
	static const char* timePerQuestion;
	static const char* questionsCount;

	//Responses
	static const char* rooms;
	static const char* playersInRoom;
	static const char* roomId;
	static const char* currentPlayerCount;
	static const char* roomStatus;
	

	/* Game */

	//Requests
	static const char* answerIndex;
	static const char* answerTime;

	//Responses
	static const char* category;
	static const char* difficulty;
	static const char* question;
	static const char* answers;
	static const char* correctAnswerIndex;
	static const char* playersResults;


	/* Statistics */
	static const char* numPoints;
	static const char* numTotalGames;
	static const char* numCorrectAnswers;
	static const char* numWrongAnswers;
	static const char* averageAnswerTime;
	static const char* highScores;


	/* Error Response */
	static const char* message;
};