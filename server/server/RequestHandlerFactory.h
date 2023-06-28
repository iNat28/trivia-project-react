#pragma once
#include "pch.h"
#include "IDatabase.h"
#include "LoginManager.h"
#include "RoomManager.h"
#include "StatisticsManager.h"
#include "GameManager.h"
#include "JsonRequestPacketDeserializer.h"
#include "JsonResponsePacketSerializer.h"
#include "IRequestHandler.h"
#include "LoginRequestHandler.h"
#include "MenuRequestHandler.h"
#include "RoomAdminRequestHandler.h"
#include "RoomMemberRequestHandler.h"
#include "GameRequestHandler.h"

class LoginRequestHandler;
class MenuRequestHandler;
class RoomAdminRequestHandler;
class RoomMemberRequestHandler;
class GameRequestHandler;

class RequestHandlerFactory
{
public:
	RequestHandlerFactory(IDatabase& database);

	sptr<LoginRequestHandler> createLoginRequestHandler();
	sptr<MenuRequestHandler> createMenuRequestHandler(LoggedUser& user);
	sptr<RoomAdminRequestHandler> createRoomAdminRequestHandler(LoggedUser& user, Room& room);
	sptr<RoomMemberRequestHandler> createRoomMemberRequestHandler(LoggedUser& user, Room& room);
	sptr<GameRequestHandler> createGameRequestHandler(LoggedUser& user, Game& game);
	
	LoginManager& getLoginManager();
	RoomManager& getRoomManager();
	StatisticsManager& getStatisticsManager();
	GameManager& getGameManager();
private:
	IDatabase& m_database;
	LoginManager m_loginManager;
	RoomManager m_roomManager;
	StatisticsManager m_statisticsManager;
	GameManager m_gameManager;
};