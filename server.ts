import axios from 'axios';
import axiosDebugLog = require('axios-debug-log');
import bodyParser = require('body-parser');
import debug from 'debug';
import * as dotenv from 'dotenv';
import express = require('express');
import moment from 'moment';
import morgan from 'morgan';
import * as util from 'util';
import { v4 as uuid } from 'uuid';
import httpLogger from './http-logger';
import * as log4js from 'log4js';
import HttpStatus from 'http-status-codes';

dotenv.config();
axiosDebugLog(httpLogger);

const port = process.env.PORT || 8080;
const app = express();

const accessToken = process.env.ACCESS_TOKEN;
const thirdPartyAccessId = process.env.THIRD_PARTY_ACCESS_ID;
const apiRegistrationId = process.env.API_REGISTRATION_ID;
const baseURL = process.env.BASE_URL;
const expiryTimeInMinutes = process.env.EXPIRY_TIME_IN_MINUTES;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(morgan('dev'));
app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));

const createUUID = () => uuid().replace(/-/g, '');

const client = axios.create({
  baseURL,
  responseType: 'json',
  headers: {
    accessToken: `Bearer ${accessToken}`,
    thirdPartyAccessId,
    apiRegistrationId,
  },
});

app.use(express.static('static'));

app.post('/api/v1/request-money', async (req, res) => {
  const { amount } = req.body;

  try {
    const response = await client.post(
      '/v2/money-requests/send',
      {
        sourceMoneyRequestId: createUUID(),
        amount,
        requestedFrom: {
          contactName: 'OWL DEMO DONOR',
          language: 'en',
          notificationPreferences: [
            {
              handle: 'throwaway@beta.inter.ac',
              handleType: 'email',
              active: true,
            },
          ],
        },
        currency: 'CAD',
        editableFulfillAmount: false,
        requesterMessage: 'Thank you for giving a Hoot!',
        expiryDate: moment()
          .utc()
          .add(expiryTimeInMinutes, 'minutes')
          .toISOString(),
        supressResponderNotifications: true,
      },
      {
        headers: {
          requestId: createUUID(),
          deviceId: createUUID(),
        },
      },
    );
    res.status(response.status);
    res.send(response.data);
  } catch (err) {
    console.log(err);
    const { response, message } = err;
    if (response) {
      const { data } = response;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      debug('app')(util.inspect(data));
      res.send();
      return;
    }
    debug('app')(util.inspect(message));
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(message);
  }
});

app.listen(port, () => {
  debug('app')(`Express web server started: http://localhost:${port}`);
});
