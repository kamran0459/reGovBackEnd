const url = require('url'),
  uuid = require('uuid/v1'),
  _ = require("lodash");

const crypto = require('../lib/helpers/crypto'),
  RestController = require('../core/Controller/RestController.js');

class RoutesHandler {
  static checkBadInput(req) {
    const payload = req.body;
    console.log("checking for illeagal characters.");
    const requestString = JSON.stringify(payload);
    if (~requestString.indexOf(`$`)) {
      console.log("illeagal characters Found Sending Error!!");
      return true;
    }
    console.log("request OK!.");
    return false;
  }

  static apiCallsHandler(req, res) {
    if (RoutesHandler.checkBadInput(req)) {
      let responseChar = {'error': "illeagal character found in request"};
      res.send(responseChar);
      return;
    }

    let payload = req.body, JWToken = '';

    if (payload.JWToken) {
      JWToken = payload.JWToken;
    }
    else {
      JWToken = req.get('token');
    }

    if (req.query) {
      Object.assign(payload, {queryParams: req.query});
    }

    if (req.headers) {
      Object.assign(payload, {headersParams: req.headers});
    }

    if (req.files && Object.keys(req.files).length > 0) {
      _.set(payload, 'files', req.files);
    }

    payload.token = JWToken;
    const action = req.params.action;
    const channel = req.params.channel;

    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    payload = Object.assign(payload, {action: action, channel: channel, ipAddress: "::1", query});
    const UUID = uuid();

    const decoded = crypto.decrypt(JWToken);
    new RestController(payload, channel, action, UUID, res, decoded).handleExternalRequest();
  }
}

module.exports = RoutesHandler;
