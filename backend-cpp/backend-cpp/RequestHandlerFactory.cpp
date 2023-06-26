#include "pch.h"
#include "RequestHandlerFactory.h"

RequestHandlerFactory::RequestHandlerFactory(IDatabase& database) : 
	m_loginManager(database), m_database(database), m_statisticsManager(database), m_roomManager(database), m_gameManager(database)
{
}

sptr<LoginRequestHandler> RequestHandlerFactory::createLoginRequestHandler()
{
	return make_shared<LoginRequestHandler>(*this);
}

sptr<MenuRequestHandler> RequestHandlerFactory::createMenuRequestHandler(LoggedUser& user)
{
	return make_shared<MenuRequestHandler>(*this, user);
}

sptr<RoomAdminRequestHandler> RequestHandlerFactory::createRoomAdminRequestHandler(LoggedUser& user, Room& room)
{
	return make_shared<RoomAdminRequestHandler>(*this, user, room);
}

sptr<RoomMemberRequestHandler> RequestHandlerFactory::createRoomMemberRequestHandler(LoggedUser& user, Room& room)
{
	return make_shared<RoomMemberRequestHandler>(*this, user, room);
}

sptr<GameRequestHandler> RequestHandlerFactory::createGameRequestHandler(LoggedUser& user, Game& game)
{
	return make_shared<GameRequestHandler>(*this, user, game);
}

LoginManager& RequestHandlerFactory::getLoginManager()
{
	return this->m_loginManager;
}

RoomManager& RequestHandlerFactory::getRoomManager()
{
	return this->m_roomManager;
}

StatisticsManager& RequestHandlerFactory::getStatisticsManager()
{
	return this->m_statisticsManager;
}

GameManager& RequestHandlerFactory::getGameManager()
{
	return this->m_gameManager;
}
