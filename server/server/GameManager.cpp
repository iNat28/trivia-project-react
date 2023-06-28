#include "pch.h"
#include "GameManager.h"
/*
Usage: GameManager C'tor.
Input: IDatabase.
Output: none.
*/
GameManager::GameManager(IDatabase& database) : 
	m_database(database)
{
}
/*
Usage: creates a game.
Input: Room, Questions.
Output: Game.
*/
Game& GameManager::createGame(Room& room, Questions questions)
{
	this->m_games.push_back(Game(room, questions));

	return this->m_games.back();
}
/*
Usage: deletes a game.
Input: Game.
Output: none.
*/
void GameManager::deleteGame(Game& game)
{
	for (auto userAndResults : game.getGameResults())
	{
		this->m_database.addGameStats(userAndResults.user, userAndResults.playerResults);
	}

	for (auto it = this->m_games.begin(); it != this->m_games.end(); it++)
	{
		if (*it == game)
		{
			this->m_games.erase(it);
			return;
		}
	}
}
/*
Usage: gets a certain game.
Input: Room.
Output: Game.
*/
Game& GameManager::getGame(Room& room)
{
	for (auto& game : this->m_games)
	{
		if (game == room)
		{
			return game;
		}
	}
	throw Exception("Couldn't find game to match the room");
}
/*
Usage: gets questions.
Input: unsigned int.
Output: Questions.
*/
Questions GameManager::getQuestions(unsigned int questionsCount) const
{
	return this->m_database.getQuestions(questionsCount);
}