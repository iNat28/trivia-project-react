#pragma once
#include "pch.h"
#include "statistics.h"
#include "Room.h"

#define ANSWERS_COUNT 4
#define INCORRECT_ANSWERS_COUNT ANSWERS_COUNT - 1
#define POINT_MULTIPLIER 100

struct Question
{
	Question(string category, unsigned int difficulty, string question, vector<string> answers, unsigned int correctAnswerIndex);
	Question();

	string category;
	unsigned int difficulty;
	string question;
	vector<string> answers;
	unsigned int correctAnswerIndex;
	
	static unsigned int getDifficulty(string difficulty);
};

typedef vector<Question> Questions;

void to_json(json& j, const Question& question);
void from_json(const json& j, Question& question);

struct GameData
{
	GameData(PlayerResults playerResults, bool gotResults, unsigned int currentQuestionIndex);
	GameData();

	PlayerResults playerResults;
	bool gotResults; //If the player recieved the data
	unsigned int currentQuestionIndex;
};

class Game
{
public:
	Game(Room& room, Questions questions);

	const Question& getQuestion(LoggedUser& user) const;
	unsigned int submitAnswer(LoggedUser& user, int answerIndex, double answerTime);
	void removePlayer(LoggedUser& user);
	static bool comparePlayerPoints(UserResults userResults1, UserResults userResults2);
	vector<UserResults> getGameResults(LoggedUser& user);
	vector<UserResults> getGameResults();
	
	Room& getRoom();
	bool allPlayersGotResults() const;
	bool operator==(const Game& other) const;
	bool operator==(const Room& other) const;

	//Needed for unknown reason
	Game& operator=(const Game& other);
private:
	Questions m_questions;
	std::unordered_map<string, GameData> m_players;
	Room& m_room;
};