#include "pch.h"
#include "RoomManager.h"

RoomManager::RoomManager(IDatabase& database) : 
	m_database(database)
{
}
/*
Usage: creates a room.
Input: Room.
Output: none.
*/
void RoomManager::createRoom(Room& room)
{
	room.setId(this->m_database.getHighestRoomId());

	this->m_rooms[room.getId()] = room;
}
/*
Usage: closes a room.
Input: Room.
Output: none.
*/
void RoomManager::closeRoom(Room& room)
{
	room.setRoomStatus(RoomStatus::CLOSED);

	if (room.getAllUsers().empty())
	{
		if (!this->m_rooms.erase(room.getId()))
		{
			throw Exception("Room ID not found");
		}
	}
}
/*
Usage: get a room.
Input: unsigned int.
Output: Room.
*/
Room& RoomManager::getRoom(unsigned int id)
{
	try
	{
		return this->m_rooms.at(id);
	}
	catch (const std::exception&)
	{
		throw Exception("Room ID not found");
	}
}
/*
Usage: gets all of the users in the room.
Input: unsigned int.
Output: vector<LoggedUser>.
*/
vector<LoggedUser> RoomManager::getUsersInRoom(unsigned int id) const
{
	return this->_getRoom(id).getAllUsers();
}
/*
Usage: get all of the rooms.
Input: none.
Output: vector<Room>.
*/
vector<Room> RoomManager::getRooms() const
{
	vector<Room> rooms;

	for (const auto& room : this->m_rooms)
	{
		if (room.second.getRoomStatus() != RoomStatus::CLOSED)
		{
			rooms.push_back(room.second);
		}
	}

	return rooms;
}

const Room& RoomManager::_getRoom(unsigned int id) const
{
	try
	{
		return this->m_rooms.at(id);
	}
	catch (const std::exception&)
	{
		throw Exception("Room ID not found");
	}
}
