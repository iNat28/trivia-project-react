#pragma once
#include "pch.h"
#include "Codes.h"
#include "Requests.h"
#include "JsonResponsePacketSerializer.h"

class IRequestHandler;

struct RequestInfo
{
	RequestInfo(Codes RequestId, time_t receivalTime, Buffer buffer, sptr<IRequestHandler> currentHandler);
	RequestInfo();

	Codes requestId;
	time_t receivalTime;
	Buffer buffer;
	sptr<IRequestHandler> currentHandler;
};

struct RequestResult
{
	RequestResult(Buffer response, sptr<IRequestHandler> newHandler);

	Buffer response;
	sptr<IRequestHandler> newHandler;
};

class IRequestHandler
{
public:
	virtual RequestResult handleRequest(RequestInfo& requestInfo) = 0;
protected:

	//Handles all of the requests from a handler, using a request map to decide which code goes to which function
	template<class Handler, class Func>
	RequestResult handleAllRequests(RequestInfo& requestInfo, Handler& handler, umap<Codes, Func> requestMap)
	{
		Func requestFunc = nullptr;

		//If at any point the requests don't work, an exception will be thrown, 
		//and it will be put into an error response
		try {
			requestFunc = requestMap.at(requestInfo.requestId);
			return (handler.*requestFunc)(requestInfo);
		}
		//Error with json parsings
		catch (const json::exception & e)
		{
			return RequestResult(
				JsonResponsePacketSerializer::serializeResponse(ErrorResponse(string("Error with parsing json: ") + e.what())),
				requestInfo.currentHandler
			);
		}
		//Something was out of range (probably the request map)
		catch (std::out_of_range)
		{
			return RequestResult(
				JsonResponsePacketSerializer::serializeResponse(ErrorResponse("Unexpected error with handlers")),
				requestInfo.currentHandler
			);
		}
		//Other exception caught
		catch (const std::exception & e)
		{
			return RequestResult(
				JsonResponsePacketSerializer::serializeResponse(ErrorResponse(e.what())),
				requestInfo.currentHandler
			);
		}
	}
};