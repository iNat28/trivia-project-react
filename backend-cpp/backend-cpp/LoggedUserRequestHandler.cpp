#include "pch.h"
#include "LoggedUserRequestHandler.h"

LoggedUserRequestHandler::LoggedUserRequestHandler(LoggedUser& user) : 
	m_user(user)
{
}
