#pragma once
#include "pch.h"
#include "LoggedUser.h"
#include "Exception.h"

#define MAX_ANSWER_TIME 1 * 60
#define MAX_QUESTION_COUNT 10

enum class RoomStatus
{
	OPEN,
	CLOSED,
	GAME_STARTED
};

struct RoomData
{
	RoomData(unsigned int id, string name, vector<LoggedUser> player, unsigned int maxPlayers, unsigned int questionsCount, unsigned int timePerQuestion);
	RoomData();

	unsigned int id;
	string name;
	vector<LoggedUser> players;
	unsigned int maxPlayers;
	unsigned int questionsCount;
	unsigned int timePerQuestion;
	RoomStatus roomStatus;
};

void to_json(json& j, const RoomData& roomData);

class Room
{
public:
	Room(RoomData roomData);
	Room();

	void addUser(LoggedUser& user);
	void removeUser(LoggedUser& user);

	unsigned int getQuestionsCount() const;
	vector<LoggedUser> getAllUsers() const;
	RoomStatus getRoomStatus() const;
	unsigned int getId() const;

	void setId(unsigned int id);
	void setRoomStatus(RoomStatus roomStatus);

	friend void to_json(json& j, const Room& room);
private:
	RoomData m_roomdata;
};
