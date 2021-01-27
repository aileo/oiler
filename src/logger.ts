enum COLOR {
  MAGENTA = 'magenta',
  RED = 'red',
  ORANGE = 'orange',
  GREEN = 'green',
  BLUE = 'blue',
  GRAY = 'gray',
  BLACK = 'black',
}

export enum LEVEL {
  EMERG = 0,
  CRITICAL,
  ERROR,
  WARNING,
  NOTICE,
  INFO,
  DEBUG,
}

const LEVEL_COLOR = {
  [LEVEL.EMERG]: COLOR.MAGENTA,
  [LEVEL.CRITICAL]: COLOR.MAGENTA,
  [LEVEL.ERROR]: COLOR.RED,
  [LEVEL.WARNING]: COLOR.ORANGE,
  [LEVEL.NOTICE]: COLOR.GREEN,
  [LEVEL.INFO]: COLOR.BLUE,
  [LEVEL.DEBUG]: COLOR.GRAY,
};

let currentLevel = LEVEL.DEBUG;

const helpers = {
  now() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  },

  log(level: LEVEL, message: string, details?: unknown): void {
    const colors = [COLOR.GRAY, LEVEL_COLOR[level], COLOR.BLACK];
    const parts: unknown[] = [helpers.now(), `[${LEVEL[level]}]`, message];

    if (level > currentLevel) return;

    window.console.log.apply(
      window.console.log,
      [
        parts.map((part) => `%c${part}`).join(' '),
        ...colors.map((color) => `color: ${color}`),
        details,
      ].filter((p) => p)
    );
    return;
  },
};

export function setLevel(level: LEVEL): void {
  currentLevel = level;
}

interface Logger {
  [level: string]: (message: string, ...details: unknown[]) => void;
}

export default Object.keys(LEVEL)
  .filter((key) => isNaN(+key))
  .reduce((logger, level) => {
    logger[level.toLowerCase()] = (message, ...details) => {
      helpers.log(
        (<any>LEVEL)[level],
        message,
        details.length > 1 ? details : details[0]
      );
    };
    return logger;
  }, {} as Logger);
