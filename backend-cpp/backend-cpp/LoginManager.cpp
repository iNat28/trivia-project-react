#include "pch.h"
#include "LoginManager.h"

LoginManager::LoginManager(IDatabase& database) :
	m_database(database)
{
}
/*
Usage: signs a player up.
Input: string, string, string.
Output: none.
*/
void LoginManager::signup(string username, string password, string email)
{
	if (this->m_database.doesUserExist(username))
	{
		throw Exception("User already signed up!");
	}

	if (username.empty())
	{
		throw Exception("Username cannot be empty!");
	}

	if (password.empty())
	{
		throw Exception("Password cannot be empty!");
	}

	if (email.empty())
	{
		throw Exception("Email cannot be empty!");
	}

	//Adds the user
	this->m_database.addNewUser(username, password, email);
	this->m_loggedUsers.push_back(username);
}
/*
Usage: logs a user in.
Input: string, string.
Output: none.
*/
void LoginManager::login(string username, string password)
{
	if (!this->m_database.doesUserExist(username))
	{
		throw Exception("User not signed up");
	}

	if (username.empty())
	{
		throw Exception("Username cannot be empty!");
	}

	if (password.empty())
	{
		throw Exception("Password cannot be empty!");
	}

	for (const auto& loggedUser : this->m_loggedUsers)
	{
		if (loggedUser.username == username)
		{
			throw Exception("User already logged in!");
		}
	}

	if (!this->m_database.doesPasswordMatch(username, password))
	{
		throw Exception("Password is incorrect!");
	}

	//Logins in the user
	this->m_loggedUsers.push_back(username);
}
/*
Usage: logs a user out.
Input: LoggedUser.
Output: none.
*/
void LoginManager::logout(LoggedUser& user)
{
	for (auto loggedUser = this->m_loggedUsers.begin(); loggedUser != this->m_loggedUsers.end(); )
	{
		if (*loggedUser == user)
		{
			loggedUser = this->m_loggedUsers.erase(loggedUser);
		}
		else
		{
			++loggedUser;
		}
	}
}
/*
Usage: gets a user.
Input: string.
Output: LoggedUser.
*/
LoggedUser& LoginManager::getUser(string username)
{
	for (auto& user : this->m_loggedUsers)
	{
		if (user.username == username)
		{
			return user;
		}
	}
	throw Exception("User not found!");
}

