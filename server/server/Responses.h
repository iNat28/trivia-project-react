#pragma once
#include "pch.h"
#include "Room.h"
#include "Codes.h"
#include "statistics.h"
#include "Game.h"

struct Response
{
	virtual Codes getResponseCode() const = 0;
};

struct ErrorResponse : Response
{
	ErrorResponse(std::string message);

	virtual Codes getResponseCode() const override;

	std::string message;
};

struct LoginResponse : Response
{
	virtual Codes getResponseCode() const override;
};

struct SignupResponse : Response
{
	virtual Codes getResponseCode() const override;
};

struct LogoutResponse : Response
{
	virtual Codes getResponseCode() const override;
};

struct GetRoomResponse : Response
{
	GetRoomResponse(const vector<Room>& rooms);

	virtual Codes getResponseCode() const override;

	const vector<Room>& rooms;
};

struct GetPlayersInRoomResponse : Response
{
	GetPlayersInRoomResponse(const vector<LoggedUser>& players);

	virtual Codes getResponseCode() const override;

	const vector<LoggedUser>& players;
};

struct GetUserStatsResponse : Response
{
	GetUserStatsResponse(const UserStats& userStats);

	virtual Codes getResponseCode() const override;

	const UserStats& userStats;
};

struct GetHighScoresResponse : Response
{
	GetHighScoresResponse(const HighScores& highScores);

	virtual Codes getResponseCode() const override;

	const HighScores& highScores;
};

struct JoinRoomResponse : Response
{
	virtual Codes getResponseCode() const override;
};

struct CreateRoomResponse : Response
{
	virtual Codes getResponseCode() const override;
};

struct CloseRoomResponse : Response
{
	virtual Codes getResponseCode() const override;
};

struct LeaveRoomResponse : Response
{
	virtual Codes getResponseCode() const override;
};

struct GetRoomStateResponse : Response
{
	GetRoomStateResponse(RoomStatus roomStatus, const vector<LoggedUser>& players);

	virtual Codes getResponseCode() const override;

	RoomStatus roomStatus;
	const vector<LoggedUser>& players;
};

struct StartGameResponse : Response
{
	virtual Codes getResponseCode() const override;
};

struct GetGameResultsResponse : Response
{
	GetGameResultsResponse(vector<UserResults> playersResults);

	virtual Codes getResponseCode() const override;

	vector<UserResults> playersResults;
};

struct SubmitAnswerResponse : Response
{
	SubmitAnswerResponse(unsigned int correctAnswerIndex);

	virtual Codes getResponseCode() const override;

	unsigned int correctAnswerIndex;
};

struct GetQuestionResponse : Response
{
	GetQuestionResponse(Question question);

	virtual Codes getResponseCode() const override;

	Question question;
};

struct LeaveGameResponse : Response
{
	virtual Codes getResponseCode() const override;
};