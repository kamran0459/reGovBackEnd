'use strict';

let config = require('../../AppConfig');
let routeConfiguration = Object.assign(require('../routeConfig/routeConfiguration.json'));

const _ = require('lodash');


let handleExternalRequest = function (payload, channel, incommingRoute, UUIDKey, responseCallback, JWToken, ConnMQ) {
  let ResponseCaller = function (data, responderMethod) {
    data = data || {};
    if (data.stack) {
      let error = {
        error: {
          message: data.toString(),
          stack: data.stack
        }
      };
      responseCallback.status(500);
      responseCallback.send(error);
      return responseCallback.end();
    }
    if (responderMethod) {
      responderMethod(responseCallback);
    }
    return responseCallback.send(data);
  };
  let route = incommingRoute;
  try {

    let routeConfig = routeConfiguration[channel][route];
    if (routeConfig.customMapping === true) {
      handleCustomMappingFunction(routeConfig.MappingfunctionName, routeConfig.CustomMappingFile, payload, UUIDKey, route, ResponseCaller, JWToken, responseCallback, routeConfiguration, channel);
      return;
    }
    responseCallback.send(errorResponse("custom mapping must be true", UUIDKey));
  }
  catch (exp) {
    responseCallback.send(errorResponse(" Route Configuration invalid", UUIDKey));
  }

};

function handleCustomMappingFunction(MappingfunctionName, CustomMappingFile, payload, UUIDKey, route, callback, JWToken, res, routeConfiguration, channel) {

  let path = _.get(routeConfiguration, `${channel}.CustomFunctionsLocation`, config.CustomFunctionsLocation)
  let fileLoc = (path) + CustomMappingFile;
  console.log(fileLoc);
  let mappingFunctions = require(fileLoc);
  return mappingFunctions[MappingfunctionName](payload, UUIDKey, route, callback, JWToken, res);

}

function errorResponse(exp, UUIDKey) {
  return {
    success: false,
    message: "Error: " + exp,
    UUID: UUIDKey
  };
}

exports.handleExternalRequest = handleExternalRequest;
