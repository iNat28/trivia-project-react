#pragma once
#include "pch.h"
#include "Game.h"
#include "IDatabase.h"

class GameManager
{
public:
	GameManager(IDatabase& database);

	Game& createGame(Room& room, Questions questions);
	void deleteGame(Game& game);
	Game& getGame(Room& room);
	Questions getQuestions(unsigned int questionsCount) const;
private:
	IDatabase& m_database;
	vector<Game> m_games;
};

