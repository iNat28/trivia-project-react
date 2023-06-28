#include "pch.h"
#include "Game.h"
/*
Usage: Question struct C'tor.
Input: string, unsigned int, string, vector<string> unsigned int.
Output: none.
*/
Question::Question(string category, unsigned int difficulty, string question, vector<string> answers, unsigned int correctAnswerIndex) :
	category(category), difficulty(difficulty), question(question), answers(answers), correctAnswerIndex(correctAnswerIndex)
{
}
/*
Usage: Question default C'tor.
Input: none.
Output: none.
*/
Question::Question() :
	correctAnswerIndex(0), difficulty(1)
{
}
/*
Usage: getting question difficulty in number.
Input: string.
Output: unsigned int.
*/
unsigned int Question::getDifficulty(string difficulty)
{
	if (difficulty == "easy")
	{
		return 1;
	}
	if (difficulty == "medium")
	{
		return 2;
	}
	return 3; //hard
}
/*
Usage: converting question to json.
Input: json, Question.
Output: none.
*/
void to_json(json& j, const Question& question)
{
	j[Keys::category] = question.category;
	j[Keys::difficulty] = question.difficulty;
	j[Keys::question] = question.question;
	j[Keys::answers] = question.answers;
}
/*
Usage: converting from json to Question struct.
Input: json, Question.
Output: none.
*/
void from_json(const json& j, Question& question)
{
	question = Question(
		j[Keys::category],
		Question::getDifficulty(j[Keys::difficulty]),
		j[Keys::question],
		j["incorrect_answers"],
		3
	);

	while (question.answers.size() < 3)
	{
		question.answers.push_back("");
	}

	question.answers.push_back(j["correct_answer"]);
}
/*
Usage: Game C'tor.
Input: Room, Questions.
Output: none.
*/
Game::Game(Room& room, Questions questions) :
	m_room(room), m_questions(questions)
{
	for (const auto player : this->m_room.getAllUsers())
	{
		this->m_players[player.username];
	}
}
/*
Usage: getting next question.
Input: LoggedUser.
Output: Question.
*/
const Question& Game::getQuestion(LoggedUser& user) const
{
	if (this->m_questions.empty())
	{
		throw Exception("Couldn't get question - no questions left!");
	}
	return this->m_questions[this->m_players.at(user.username).currentQuestionIndex];
}
/*
Usage: submitting answer and calculation stats for that question.
Input: LoggedUser, int, double.
Output: unsigned int.
*/
unsigned int Game::submitAnswer(LoggedUser& user, int answerIndex, double answerTime)
{
	GameData& gameData = this->m_players[user.username];
	const Question& question = this->getQuestion(user);
	//we had to dissect the current average answer time to get the new average answer time.
	gameData.playerResults.averageAnswerTime =
		(gameData.playerResults.averageAnswerTime * gameData.playerResults.totalNumAnswers() + answerTime) /
		(gameData.playerResults.totalNumAnswers() + 1.0);
	if (question.correctAnswerIndex == answerIndex)
	{
		gameData.playerResults.numCorrectAnswers++;
		gameData.playerResults.numPoints += (unsigned int)(question.difficulty * (MAX_ANSWER_TIME + 1.0 - answerTime) * POINT_MULTIPLIER);
	}
	else
	{
		gameData.playerResults.numWrongAnswers++;
	}

	gameData.currentQuestionIndex++;
	return question.correctAnswerIndex;
}
/*
Usage: removes player from game.
Input: LoggedUser.
Output: none.
*/
void Game::removePlayer(LoggedUser& user)
{
	this->m_players[user.username].gotResults = true;
}
/*
Usage: a helper function to sort the results.
Input: UserResults, UserResults.
Output: bool.
*/
bool Game::comparePlayerPoints(UserResults userResults1, UserResults userResults2)
{
	return (userResults1.playerResults.numPoints > userResults2.playerResults.numPoints);
}

/*
Usage: gets game results.
Input: LoggedUser.
Output: vector<UserResults>.
*/
vector<UserResults> Game::getGameResults(LoggedUser& user)
{
	if (this->m_players.at(user.username).currentQuestionIndex < this->m_questions.size())
	{
		throw Exception("The game isn't over!");
	}

	return this->getGameResults();
}
/*
Usage: a helper function to get game results.
Input: none.
Output: vector<UserResults>.
*/
vector<UserResults> Game::getGameResults()
{
	vector<UserResults> playersResults;

	//Converts the map so the value will be PlayerResults and not GameData
	for (const auto player : this->m_players)
	{
		playersResults.push_back(UserResults(player.first, player.second.playerResults));
	}

	std::sort(playersResults.begin(), playersResults.end(), comparePlayerPoints);

	return playersResults;
}
/*
Usage: gets a room.
Input: none.
Output: Room.
*/
Room& Game::getRoom()
{
	return this->m_room;
}
/*
Usage: makes usre all of the players got the results.
Input: none.
Output: bool.
*/
bool Game::allPlayersGotResults() const
{
	for (const auto& player : this->m_players)
	{
		if (!player.second.gotResults)
		{
			return false;
		}
	}

	return true;
}

bool Game::operator==(const Game& other) const
{
	return this->m_room.getId() == other.m_room.getId();
}

bool Game::operator==(const Room& other) const
{
	return this->m_room.getId() == other.getId();
}

Game& Game::operator=(const Game& other)
{
	this->m_players = other.m_players;
	this->m_questions = other.m_questions;
	std::cout << "Copied game" << std::endl;
	return *this;
}
/*
Usage: GameData C'tor.
Input: PlayerResults, bool, unsigned int.
Output:
*/
GameData::GameData(PlayerResults playerResults, bool gotResults, unsigned int currentQuestionIndex) :
	playerResults(playerResults), gotResults(gotResults), currentQuestionIndex(currentQuestionIndex)
{
}
/*
Usage: GameData default C'tor.
Input: none.
Output: none.
*/
GameData::GameData() :
	playerResults(), gotResults(false), currentQuestionIndex(0)
{
}
