import {createReadStream} from 'node:fs';
import {Transform, pipeline} from 'node:stream';
import chalk from 'chalk';
import {parseOffer} from './parse-offer.js';

function formatOffer(line: string): string {
  return line.trim() ? `${chalk.cyan(JSON.stringify(parseOffer(line), null, 2))}\n` : '';
}

export function importOffers(filepath: string): void {
  let remainder = '';
  const parser = new Transform({
    decodeStrings: false,
    transform(chunk: string, _encoding, callback) {
      try {
        const lines = (remainder + chunk).split('\n');
        remainder = lines.pop() ?? '';
        return callback(null, lines.map(formatOffer).join(''));
      } catch (error) {
        const parseError = error as Error;
        return callback(parseError);
      }
    },
    flush(callback) {
      try {
        return callback(null, formatOffer(remainder));
      } catch (error) {
        const parseError = error as Error;
        return callback(parseError);
      }
    },
  });

  pipeline(createReadStream(filepath, {encoding: 'utf8'}), parser, process.stdout,
    (error) => {
      if (error) {
        console.error(chalk.red(`Ошибка импорта: ${error.message}`));
        process.exitCode = 1;
      }
    });
}
