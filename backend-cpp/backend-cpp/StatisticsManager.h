#pragma once
#include "pch.h"
#include "IDatabase.h"
#include "statistics.h"

class StatisticsManager
{
public:
	StatisticsManager(IDatabase& database);

	UserStats getUserStats(LoggedUser& user);
	HighScores getHighScores();
private:
	IDatabase& m_database;
};

