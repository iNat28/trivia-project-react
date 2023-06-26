#include "pch.h"
#include "IRequestHandler.h"

RequestInfo::RequestInfo(Codes RequestId, time_t receivalTime, Buffer buffer, sptr<IRequestHandler> currentHandler) :
	requestId(RequestId), receivalTime(receivalTime), buffer(buffer), currentHandler(currentHandler)
{
}

RequestInfo::RequestInfo() :
	requestId(Codes::ERROR_CODE), receivalTime(0)
{
}

RequestResult::RequestResult(Buffer response, sptr<IRequestHandler> newHandler) :
	response(response), newHandler(newHandler)
{
}