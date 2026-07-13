/* eslint-disable no-global-assign */
import pino, { LoggerOptions, StreamEntry } from "pino";
import debug from "debug";
import pinoPretty from "pino-pretty";
import { serverConfig } from "@web/config/server";

const {
  app: { name },
  log: { enabled },
} = serverConfig;

const originalConsole = { ...console };

const prettifier = pinoPretty({
  colorize: true,
  levelFirst: true,
  translateTime: "SYS:hh:mm:ss TT",
});
const installLogger: () => pino.Logger = () => {
  const isProduction = process.env.NODE_ENV === "production";

  let streams: StreamEntry[] = [{ stream: prettifier }];
  let pinoOptions: LoggerOptions = {
    name,
    base: null, // removes {pid: process.pid, hostname: os.hostname} from each line
    timestamp: true,
    // prettifier: pinoPretty as any,
  };

  if (!isProduction) {
    streams.push({ stream: prettifier });
  }
  const loggerImpl = pino(pinoOptions, pino.multistream(streams));
  // const loggerImpl = pino(pinoOptions);

  // monkey patch
  // console.error = loggerImpl.error.bind(loggerImpl);
  // console.log = loggerImpl.info.bind(loggerImpl);
  // console.info = loggerImpl.info.bind(loggerImpl);
  // console.warn = loggerImpl.warn.bind(loggerImpl);
  // console.debug = loggerImpl.debug.bind(loggerImpl);
  // console.trace = loggerImpl.trace.bind(loggerImpl);

  return loggerImpl;
};

const loggerSingleton = () => {
  let logger: pino.Logger;
  return () => {
    if (!logger) {
      logger = installLogger();
    }
    return logger;
  };
};

const getLogger = loggerSingleton();

getLogger();

const _installLogger = installLogger;
export { _installLogger as installLogger };

export const uninstallLogger: () => void = () => {
  console = originalConsole;
};

const _debug: (e: string) => debug.Debugger = (namespace) => {
  const log = debug(namespace);
  if (process.env.NODE_ENV !== "test" && enabled) {
    const logger = getLogger();
    log.log = logger.info.bind(logger);
  }
  return log;
};

// Object.keys(debug).forEach(key => {
// 	_debug[key] = debug[key];
// });

export default _debug;
