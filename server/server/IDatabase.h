#pragma once
#include "pch.h"
#include "sqlite3.h"
#include "statistics.h"
#include "Game.h"

class IDatabase
{
public:
	virtual bool doesUserExist(string username) const = 0;
	virtual bool doesPasswordMatch(string username, string password) const = 0;
	virtual void addNewUser(string username, string password, string email) const = 0;
	virtual void addGameStats(LoggedUser& user, PlayerResults playerResults) = 0;
	virtual int getHighestRoomId() const = 0;
	virtual UserStats getUserStats(LoggedUser& user) const = 0;
	virtual HighScores getHighScores() const = 0;
	virtual Questions getQuestions(unsigned int questionsCount) const = 0;
};