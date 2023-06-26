#include "pch.h"
#include "LoggedUser.h"

LoggedUser::LoggedUser(string username) :
	username(username)
{
}

LoggedUser::LoggedUser()
{
}

bool LoggedUser::operator==(const LoggedUser& other) const
{
	return this->username == other.username;
}

void to_json(json& j, const LoggedUser& loggedUser)
{
	j[Keys::username] = loggedUser.username;
}