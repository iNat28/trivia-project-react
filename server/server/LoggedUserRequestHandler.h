#pragma once
#include "IRequestHandler.h"

class LoggedUserRequestHandler :
	public IRequestHandler
{
protected:
	LoggedUserRequestHandler(LoggedUser& user);

	LoggedUser m_user;
};

