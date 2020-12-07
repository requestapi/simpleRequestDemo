import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { green, red, yellow } from 'colors';
import moment from 'moment';
import * as util from 'util';
import * as lawgs from 'lawgs';
import * as log4js from 'log4js';

const stripColors = (str) => {
  return ('' + str).replace(/\x1B\[\d+m/g, '');
};

log4js.configure({
  appenders: { file: { type: 'file', filename: 'logs/move-the-dial.log' } },
  categories: { default: { appenders: ['file'], level: 'debug' } },
});

const log4jsLogger = log4js.getLogger('http');

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const cloudWatchRegion = process.env.CLOUD_WATCH_REGION;
lawgs.config({
  aws: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
    region: cloudWatchRegion || 'us-east-2',
  },
});
const logGroup = process.env.LOG_GROUP;
const logger = lawgs.getOrCreate(logGroup || 'move-the-dial');

const showDebugLogs = process.env.SHOW_CLOUD_WATCH_DEBUG_LOGS === 'true';
logger.config({
  showDebugLogs: showDebugLogs || false,
});

const timestamp = () => moment().format('YYYY-MM-DD HH:mm:ss:SSS');
const requestMethod = (method: string) => method!.toLocaleUpperCase();

export default {
  request: (axiosDebug, config: AxiosRequestConfig) => {
    const { method, url, headers, data } = config;
    const logMsg =
      `${yellow(requestMethod(method!))} ${url} \n` +
      `${yellow('headers')}\n ${util.inspect(headers)} \n` +
      `${data ? `${yellow('body')}\n ${util.inspect(data)}\n` : ''}`;
    const timeStampedLogMsg = `[${timestamp()}] ${logMsg}`;
    axiosDebug(timeStampedLogMsg);
    logger.log('request', timeStampedLogMsg);
    logger.log('http', timeStampedLogMsg);
    log4jsLogger.info(stripColors(logMsg.replace(/(\r\n\t|\n|\r\t)/gm, '')));
  },
  response: (axiosDebug, response: AxiosResponse<any>) => {
    if (!response) {
      return;
    }
    const {
      config: { method, url },
      status,
      statusText,
      data,
    } = response;
    const logMsg =
      `${yellow(requestMethod(method!))} ${url}` +
      ` ${green(status.toString())} ${statusText} \n` +
      `${yellow('data')}\n ${util.inspect(data)} \n`;
    const timeStampedLogMsg = `[${timestamp()}] ${logMsg}`;
    axiosDebug(timeStampedLogMsg);
    logger.log('response', timeStampedLogMsg);
    logger.log('http', timeStampedLogMsg);
    log4jsLogger.debug(stripColors(logMsg.replace(/(\r\n\t|\n|\r\t)/gm, '')));
  },
  error: (axiosDebug, err: AxiosError) => {
    const { config, code, message, request, response, stack } = err;
    const method = config ? config.method : '';
    const url = config ? config.url : '';
    const logMsg =
      `${red(err.name)}` +
      ` ${yellow(requestMethod(method!))} ${url}` +
      ` ${red(code!)} ${message} \n` +
      `${yellow('response')} \n` +
      `${util.inspect(parseResponse(response!))} \n` +
      `${yellow('stack')} \n` +
      `${util.inspect(stack)} \n`;
    const timeStampedLogMsg = `[${timestamp()}] ${logMsg}`;
    axiosDebug(timeStampedLogMsg);
    logger.log('error', timeStampedLogMsg);
    logger.log('http', timeStampedLogMsg);
    log4jsLogger.error(stripColors(logMsg.replace(/(\r\n\t|\n|\r\t)/gm, '')));
  },
};

// The actual response contains a lot of garbage data, we just want to extract
// the features we care about; namely don't take the request.
function parseResponse(response: AxiosResponse) {
  if (!response) {
    return;
  }
  const { status, statusText, headers, data } = response;
  return {
    status,
    statusText,
    headers,
    data,
  };
}
