#pragma once
#include "pch.h"
#include "Room.h"
#include "IDatabase.h"

class RoomManager
{
public:
	RoomManager(IDatabase& database);
	
	void createRoom(Room& room);
	void closeRoom(Room& room);
	Room& getRoom(unsigned int id);
	vector<LoggedUser> getUsersInRoom(unsigned int id) const;
	vector<Room> getRooms() const;
private:
	umap<int, Room> m_rooms;
	IDatabase& m_database;

	const Room& _getRoom(unsigned int id) const;
};