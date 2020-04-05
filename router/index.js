const express = require('express'),
  router = express.Router(),
  appConfig = require('../AppConfig');

const RoutesHandler = require('./routesHandler');


router.post('/login', function (req, res) {

  const payload = req.body;
  payload.action = '/login';
  payload.remoteAddress = req.connection.remoteAddress;
  const response = {
    loginResponse: {
      action: 'login',
      data: {
        message: {
          status: 'OK',
          errorDescription: 'logged in successfully !!!',
          routeTo: '',
          displayToUser: true
        },
        success: true,
        token: '',
        firstScreen: ''
      }
    }
  };

  const apiResponse = {
    messageStatus: 'OK',
    errorCode: 200,
    errorDescription: "logged in successfully !!!",
    token: "",
    timestamp: ""
  };

  if (checkBadInput(req)) {
    let err = {
      desc: 'The username or password is incorrect'
    };
    response.loginResponse.data.message.status = 'ERROR';
    response.loginResponse.data.message.errorDescription = err.desc || err.stack || err;
    response.loginResponse.data.success = false;
    res.send(response);
    return;
  }

  authUser(payload)
    .then((user) => {
      if (user.userType == "API") {
        apiResponse.token = user.token;
        res.send(apiResponse);
      }
      else {
        response.loginResponse.data.token = user.token;
        response.loginResponse.data.firstScreen = user.firstScreen;

        res.send(response);
      }
    })
    .catch((err) => {
      logger.error({
        fs: 'app.js',
        func: 'login',
        error: err.stack || err
      }, 'login failed');
      response.loginResponse.data.message.status = 'ERROR';
      response.loginResponse.data.message.errorDescription = err.desc || err.stack || err;
      response.loginResponse.data.success = false;
      res.send(response);
    });
});

router.post('/uploadFile/:action', function (req, res) {
  if (checkBadInput(req)) {
    let resperr = {'error': "illeagal character found in request"};
    res.send(resperr);
    return;
  }
  let org = config.get('downloadAPIDetail.organization');
  if (org === 'Entity' || org === 'Acquirer') {
    console.log('=============Calling GSB==============');

    let options = {
      method: 'POST',
      uri: config.get('downloadAPIDetail.gsbURLs.upload'),
      formData: {
        name: 'files',
        file: {
          value: req.files.file.data,
          options: {
            filename: req.files.file.name,
            contentType: req.files.file.mimetype
          }
        }
      },
      headers: {
        'content-type': 'multipart/form-data',
        source: req.body.source || '',
        type: req.body.type,
        context: req.body.context,
        username: config.get('downloadAPIDetail.credentials.username'),
        password: config.get('downloadAPIDetail.credentials.password')
      }
    };
    rp(options)
      .then((responses) => {
        res.send(JSON.parse(responses));
      })
      .catch(function (err) {
        let response = {
          "status": "ERROR",
          "message": "Failed to connect GSB",
          err: err.stack || err
        };
        res.send(response);
        res.end();
      });
  }
  else {
    console.log('=============Organization is not entity==============');
    const JWToken = req.get('token');
    const decoded = crypto.decrypt(JWToken);
    const file = req.files.file;
    const fileName = file.name;
    const arr = fileName.split('.');
    const ext = arr[1];
    const userID = decoded.userID;

    const UUID = uuid();
    const source = req.headers.source || req.body.source;
    const params = req.headers.type || req.body.type;
    const context = req.headers.context || req.body.context;

    if (!file) {
      logger.error({
        fs: 'app.js',
        func: 'uploadFile'
      }, ' [ File Upload Service ] File is not exist in req : ' + req.file);
      res.send('File does not exist');
    }
    else {
      fileUploadValid(file, UUID, ext, params, userID, source, context, function (data) {
        console.log(data);
        res.send(data);
      });
    }

  }
});

router.get(`/${appConfig.APIVersion}/:channel/:action`, RoutesHandler.apiCallsHandler);

router.post(`/${appConfig.APIVersion}/:channel/:action`, RoutesHandler.apiCallsHandler);

module.exports = router;
