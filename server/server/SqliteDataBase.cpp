#include "pch.h"
#include "SqliteDataBase.h"

umap<string, string> SqliteDataBase::m_usersList;
vector<UserStats> SqliteDataBase::m_usersStats;
bool SqliteDataBase::moreData = false;
int SqliteDataBase::highestRoomId = 1;
std::mutex mtx;
/*
Usage: C'tor.
Input: none.
Output: none.
*/
SqliteDataBase::SqliteDataBase()
{
	this->openDB();
}

/*
Usage: checks whether a user exists in the DB.
Input: string username.
Output: bool.
*/
bool SqliteDataBase::doesUserExist(string username) const
{
	moreData = false;
	std::string sqlStatement = "select * from users where username = '" + username + "';";
	send_query(sqlStatement, users_callback);
	
	//returns if the username can be found in the map of users.
	return m_usersList.find(username) != m_usersList.end();
}

/*
Usage: checks if the password matches the username.
Input: string username, string password.
Output: bool.
*/
bool SqliteDataBase::doesPasswordMatch(string username, string password) const
{
	moreData = false;
	std::string sqlStatement = "select * from users where username = '" + username + "';";
	send_query(sqlStatement, users_callback);
	//returns whether the user exists and if the password matched the username
	return doesUserExist(username) && m_usersList[username] == password;
}

/*
Usage: adds a new user to the DB
Input: string username, string password, string email.
Output: void.
*/
void SqliteDataBase::addNewUser(string username, string password, string email) const
{
	std::string command = "insert into users (username, password, email) values ('" + username + "', '" + password + "', '" + email + "');";
	send_query(command);
	command = "insert into statistics (username, numPoints, numTotalGames, numCorrectAnswers, numWrongAnswers, averageAnswerTime) values ('" +
		username + "', 0, 0, 0, 0, 0.0);";
	send_query(command);
}

/*
Usage: opens the DB.
Input: none.
Output: bool.
*/
void SqliteDataBase::openDB()
{
	string command;
	this->dbFileName = "DBFile.sqlite";

	int doesFileExist = _access(this->dbFileName, 0);
	//opens the file
	int res = sqlite3_open(this->dbFileName, &this->db);
	if (res != SQLITE_OK)
	{
		this->dbFileName = nullptr;
		this->db = nullptr;
		throw std::exception("Error opening Sqlite Database");
	}

	//if the table does not exist
	if (doesFileExist)
	{
		//user table
		command = "create table if not exists users (username text primary key not null, password text not null, email text not null);";
		send_query(command);

		//statistics table
		command = "create table if not exists statistics (username text primary key not null, numPoints integer not null, numTotalGames integer not null, numCorrectAnswers integer not null, numWrongAnswers integer not null, averageAnswerTime real not null);";
		send_query(command);

		//questions table
		command = "create table if not exists questions (question text primary key not null, category text, difficulty integer not null, correct_answer text not null, incorrect_answer1 text not null, incorrect_answer2 text, incorrect_answer3 text);";
		send_query(command);
		//adding the questions
		openQuestionsFile();
	}

	SqliteDataBase::moreData = false;
}

/*
Usage: the users callback.
Input: data, argc, argv, azcolname.
Output: int.
*/
int SqliteDataBase::users_callback(void* data, int argc, char** argv, char** azColName)
{
	//to make sure it doesnt clear the list when it goes back into the function to add another user.
	if (!SqliteDataBase::moreData)
		SqliteDataBase::m_usersList.clear();

	string username;
	string password;

	//gets all of the usernames and password and adds them into the map.
	for (int i = 0; i < argc; i++)
	{
		if (std::string(azColName[i]) == "username")
			username = argv[i];
		else if (std::string(azColName[i]) == "password")
			password = argv[i];
	}

	//adds the new user to the list.
	SqliteDataBase::m_usersList[username] = password;
	SqliteDataBase::moreData = true;
	return 0;
}
/*
Usage: callback for the statistics table. returns user's statistics.
Input: callback input.
Output: int.
*/
int SqliteDataBase::statistics_callback(void* data, int argc, char** argv, char** azColName)
{
	if (!SqliteDataBase::moreData)
		SqliteDataBase::m_usersStats.clear();

	UserStats userStats;
	//a loop to get all of the stats
	for (int i = 0; i < argc; i++)
	{
		if (std::string(azColName[i]) == "username")
			userStats.username = argv[i];
		else if (std::string(azColName[i]) == "numPoints")
			userStats.playerResults.numPoints = atoi(argv[i]);
		else if (std::string(azColName[i]) == "numTotalGames")
			userStats.numTotalGames = atoi(argv[i]);
		else if (std::string(azColName[i]) == "numCorrectAnswers")
			userStats.playerResults.numCorrectAnswers = atoi(argv[i]);
		else if (std::string(azColName[i]) == "numWrongAnswers")
			userStats.playerResults.numWrongAnswers = atoi(argv[i]);
		else if (std::string(azColName[i]) == "averageAnswerTime")
			userStats.playerResults.averageAnswerTime = atof(argv[i]);
	}
	//adding to the list of user stats	
	SqliteDataBase::m_usersStats.push_back(userStats);
	SqliteDataBase::moreData = true;
	return 0;
}
/*
Usage: a callback for a single int.
Input: callback input.
Output: int.
*/
int SqliteDataBase::int_callback(void* data, int argc, char** argv, char** azColName)
{
	int* intReturn = static_cast<int*>(data);

	if (intReturn != nullptr)
	{
		*intReturn = atoi(argv[0]);
	}

	return 0;
}
/*
Usage: a callback for the questions.
Input: callback input.
Output: int.
*/
int SqliteDataBase::questions_callback(void* data, int argc, char** argv, char** azColName)
{
	Questions* questions = static_cast<Questions*>(data);
	Question question;
	int i = 0;
	//the pair is used for the index
	vector<std::pair<unsigned int, string>> answers;

	for (int i = 0; i < argc; i++)
	{
		if (std::string(azColName[i]) == "question")
			question.question = argv[i];
		else if (std::string(azColName[i]) == "category")
			question.category = argv[i];
		else if (std::string(azColName[i]) == "difficulty")
			question.difficulty = atoi(argv[i]);
		else if (std::string(azColName[i]) == "correct_answer")
			answers.push_back({ 0, argv[i] });
		else if (std::string(azColName[i]) == "incorrect_answer1")
			answers.push_back({ 1, argv[i] });
		else if (std::string(azColName[i]) == "incorrect_answer2" && string(argv[i]) != "")
			answers.push_back({ 2, argv[i] });
		else if (std::string(azColName[i]) == "incorrect_answer3" && string(argv[i]) != "")
			answers.push_back({ 3, argv[i] });
	}
	//shuffling the answer indexes
	std::random_shuffle(answers.begin(), answers.end());
	//getting the index for the correct answer
	for (auto& answer : answers)
	{
		//If it's the first index (the correct answer)
		if (answer.first == 0)
		{
			question.correctAnswerIndex = i;
		}
		question.answers.push_back(answer.second);
		i++;
	}

	if (questions != nullptr)
	{
		questions->push_back(question);
	}

	return 0;
}
/*
Usage: a function to send a sql query.
Input: string command and callback function with all of the callback input.
Output: none.
*/
void SqliteDataBase::send_query(std::string command, int(*callback)(void*, int, char**, char**), void* data) const
{
	char* errMessage = nullptr;
	std::lock_guard<std::mutex> guard(mtx);
	if (SQLITE_OK != sqlite3_exec(this->db, command.c_str(), callback, data, &errMessage))
	{
		Exception::ex << errMessage;
		sqlite3_free(errMessage);
		throw Exception();
	}
}
/*
Usage: getting the map of questions from the questions file.
Input: none.
Output: none.
*/
void SqliteDataBase::openQuestionsFile()
{
	//If the question file doesn't exist
	if (_access(QUESTIONS_FILE, 0) == ENOENT)
	{
		throw Exception("Question file needed to create database");
	}

	std::ifstream file(QUESTIONS_FILE);

	json j;
	file >> j;
	vector<Question> questionList = j["results"];
	
	addToDB(questionList);
}
/*
Usage: getting the questions into a vector.
Input: string - all of the questions and info.
Output: vector<Question>.
*/
vector<Question> SqliteDataBase::getQuestionsIntoVectorFormat(string questionsStr)
{
	string questionInfo;
	json questionList = json::parse(questionsStr);

	vector<Question> questions = questionList;
	return questions;
}

/*
Usage: adding a vector of questions into the DB.
Input: vector<Question>.
Output: none.
*/
void SqliteDataBase::addToDB(vector<Question> questionsList)
{
	sstream buffer;

	for (const auto& question : questionsList)
	{
		string correctAnswer = question.answers[question.correctAnswerIndex];
		vector<string> incorrectAnswers;

		int i = 0;
		for (const auto& answer : question.answers)
		{
			if (i != question.correctAnswerIndex)
			{
				incorrectAnswers.push_back(answer);
			}
			i++;
		}

		buffer << "insert into questions(question, category, difficulty, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3) values(" <<
			'"' << question.question << "\", " <<
			'"' << question.category << "\", " <<
			question.difficulty << ", " <<
			'"' << correctAnswer << "\", " <<
			'"' << incorrectAnswers[0] << "\", " <<
			'"' << incorrectAnswers[1] << "\", " <<
			'"' << incorrectAnswers[2] << "\");";
		
		send_query(buffer.str().c_str());
		buffer.str("");
	}
}
/*
Usage: gets the highest id of a current room in order to give an id to the next room.
Input: none.
Output: int.
*/
int SqliteDataBase::getHighestRoomId() const
{
	return this->highestRoomId++;
}
/*
Usage: adding stats to DB after each game.
Input: LoggedUser, PlayerResults.
Output: none.
*/
void SqliteDataBase::addGameStats(LoggedUser& user, PlayerResults playerResults)
{
	sstream buffer;
	UserStats otherUserStats = SqliteDataBase::getUserStats(user);
	//adding the stats
	otherUserStats.playerResults.setAverageAnswerTime(playerResults);
	otherUserStats.playerResults.numPoints += playerResults.numPoints;
	otherUserStats.numTotalGames++;
	otherUserStats.playerResults.numCorrectAnswers += playerResults.numCorrectAnswers;
	otherUserStats.playerResults.numWrongAnswers += playerResults.numWrongAnswers;
	
	buffer << "update statistics set" <<
		" numPoints = " << otherUserStats.playerResults.numPoints <<
		", numTotalGames = " << otherUserStats.numTotalGames <<
		", numCorrectAnswers = " << otherUserStats.playerResults.numCorrectAnswers <<
		", numWrongAnswers = " << otherUserStats.playerResults.numWrongAnswers <<
		", averageAnswerTime = " << otherUserStats.playerResults.averageAnswerTime <<
		" where username = \"" << otherUserStats.username << "\";";

	send_query(buffer.str().c_str());
}
/*
Usage: getting a users stats from the DB.
Input: LoggedUser.
Output: UserStats.
*/
UserStats SqliteDataBase::getUserStats(LoggedUser& user) const
{
	SqliteDataBase::moreData = false;
	sstream buffer;

	buffer << "select * from statistics where username = '" << user.username << "';";
	send_query(buffer.str().c_str(), statistics_callback);
	
	return m_usersStats[0];
}
/*
Usage: get the high scores from the DB.
Input: none.
Output: HighScores.
*/
HighScores SqliteDataBase::getHighScores() const
{
	HighScores highScores;
	SqliteDataBase::moreData = false;
	sstream buffer;

	buffer << "select username, numPoints from statistics order by numPoints DESC limit " << SqliteDataBase::HIGH_SCORE_NUMS << ';';
	send_query(buffer.str().c_str(), statistics_callback);

	for (auto& userStats : m_usersStats)
	{
		highScores.push_back(UserHighScore(userStats.username, userStats.playerResults.numPoints));
	}

	return highScores;
}
/*
Usage: getting the questions from the DB.
Input: unsigned int - number of questions.
Output: Questions.
*/
Questions SqliteDataBase::getQuestions(unsigned int questionsCount) const
{
	Questions questions;
	std::srand((unsigned int)std::time(0));

	send_query("select * from questions", questions_callback, &questions);

	std::random_shuffle(questions.begin(), questions.end());

	//Assumes that the questions count is valid, since it was already checked
	questions.resize(questionsCount);

	return questions;
}
