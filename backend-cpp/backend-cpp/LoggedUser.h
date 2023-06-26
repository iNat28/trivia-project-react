#pragma once
#include "pch.h"
#include "Keys.h"

struct LoggedUser
{
	LoggedUser(string username);
	LoggedUser();

	string username;

	bool operator==(const LoggedUser& other) const;
};

void to_json(json& j, const LoggedUser& loggedUser);