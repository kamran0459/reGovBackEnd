let config = require('../../AppConfig');
let routeConfiguration = Object.assign(require('../routeConfig/routeConfiguration.json'));
const _ = require('lodash');


class RestController {
  constructor (payload, channel, action, UUID, res, decoded) {
    this.payload = payload;
    this.channel = channel;
    this.action = action;
    this.UUID = UUID;
    this.res = res;
    this.decoded = decoded;
  }

  handleExternalRequest () {
    let payload = this.payload, channel = this.channel, UUIDKey = this.UUID, responseCallback = this.res, JWToken = this.decoded;
    let route = this.action;

    const ResponseCaller = (data, responderMethod) => {
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


    try {

      let routeConfig = routeConfiguration[channel][route];
      if (routeConfig["customMapping"] === true) {
        RestController.handleCustomMappingFunction(routeConfig["MappingFunctionName"], routeConfig.CustomMappingFile, payload, UUIDKey, route, ResponseCaller, JWToken, responseCallback, routeConfiguration, channel);
        return;
      }
      responseCallback.send(RestController.errorResponse("custom mapping must be true", UUIDKey));
    }
    catch (exp) {
      responseCallback.send(RestController.errorResponse(exp, UUIDKey));
    }

  }
  static handleCustomMappingFunction(MappingFunctionName, CustomMappingFile, payload, UUIDKey, route, callback, JWToken, res, routeConfiguration, channel) {
    let path = _.get(routeConfiguration, `${channel}.CustomFunctionsLocation`, config.CustomFunctionsLocation);
    let fileLoc = (path) + CustomMappingFile;
    console.log(fileLoc);
    let mappingFunctions = require(fileLoc);
    return mappingFunctions[MappingFunctionName](payload, UUIDKey, route, callback, JWToken, res);
  }
  static errorResponse(exp, UUIDKey) {
    return {
      success: false,
      message: "Error: " + exp,
      UUID: UUIDKey
    };
  }
}

module.exports = RestController;
