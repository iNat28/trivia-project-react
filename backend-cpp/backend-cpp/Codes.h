#pragma once

enum class Codes
{
	ERROR_CODE = 0,

	//Login
	LOGIN = 10,
	SIGNUP,
	LOGOUT,


	//Menu
	GET_ROOM = 20,
	GET_PLAYERS_IN_ROOM,
	JOIN_ROOM,
	CREATE_ROOM,

	//Statistics
	USER_STATS,
	HIGH_SCORES,


	//Room
	GET_ROOM_STATE = 30,

	//RoomAdmin
	CLOSE_ROOM,
	START_GAME,

	//RoomMember
	LEAVE_ROOM,

	
	//Game
	GET_GAME_RESULTS,
	SUBMIT_ANSWER,
	GET_QUESTION,
	LEAVE_GAME
};

enum class ResponseCodes
{
	ERROR_RESPONSE,
	SUCCESFUL
};