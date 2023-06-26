#include "pch.h"
#include "Statistics.h"

UserHighScore::UserHighScore(string username, unsigned int numPoints) :
	username(username), numPoints(numPoints)
{
}

UserHighScore::UserHighScore() :
	numPoints(0)
{
}

UserStats::UserStats(PlayerResults playerResults, string username, unsigned int numTotalGames) :
	playerResults(playerResults), username(username), numTotalGames(numTotalGames)
{
}

UserStats::UserStats() :
	playerResults(), username(), numTotalGames(0)
{
}

PlayerResults::PlayerResults(unsigned int numCorrectAnswers, unsigned int numWrongAnswers, 
								double averageAnswerTime, unsigned int numPoints) :
	numCorrectAnswers(numCorrectAnswers), numWrongAnswers(numWrongAnswers), averageAnswerTime(averageAnswerTime), numPoints(numPoints)
{
}

PlayerResults::PlayerResults() : 
	numCorrectAnswers(0), numWrongAnswers(0), averageAnswerTime(0), numPoints(0)
{
}
/*
Usage: calculates the average answer time by dissecting the current answer time and adding to that the answer time and calculating it again.
Input:
Output:
*/
void PlayerResults::setAverageAnswerTime(const PlayerResults& other)
{
	this->averageAnswerTime =
		(other.averageAnswerTime * other.totalNumAnswers() + this->averageAnswerTime * this->totalNumAnswers()) /
		(other.totalNumAnswers() + this->totalNumAnswers());
}


double PlayerResults::totalNumAnswers() const
{
	return double(this->numCorrectAnswers + this->numWrongAnswers);
}

void to_json(json& j, const UserHighScore& userHighScore)
{
	j[Keys::username] = userHighScore.username;
	j[Keys::numPoints] = userHighScore.numPoints;
}

void to_json(json& j, const PlayerResults& playerResults)
{
	j[Keys::numCorrectAnswers] = playerResults.numCorrectAnswers;
	j[Keys::numWrongAnswers] = playerResults.numWrongAnswers;
	j[Keys::averageAnswerTime] = playerResults.averageAnswerTime;
	j[Keys::numPoints] = playerResults.numPoints;
}

void to_json(json& j, const UserResults& userResults)
{
	j = userResults.playerResults;
	j[Keys::username] = userResults.user.username;
}

void to_json(json& j, const UserStats& userStats)
{
	j = userStats.playerResults;
	j[Keys::username] = userStats.username;
	j[Keys::numTotalGames] = userStats.numTotalGames;
}

UserResults::UserResults(LoggedUser user, PlayerResults playerResults) : 
	user(user), playerResults(playerResults)
{
}
