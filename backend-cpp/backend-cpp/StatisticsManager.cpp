#include "pch.h"
#include "StatisticsManager.h"

StatisticsManager::StatisticsManager(IDatabase& database) :
	m_database(database)
{
}
/*
Usage: getting a user's stats
Input: LoggedUser.
Output: UserStats.
*/
UserStats StatisticsManager::getUserStats(LoggedUser& user)
{
	return this->m_database.getUserStats(user);
}
/*
Usage: getting the high scores.
Input: none.
Output: HighScores.
*/
HighScores StatisticsManager::getHighScores()
{
	return this->m_database.getHighScores();
}
