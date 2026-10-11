import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import chalk from 'chalk';
import {parseOffer} from './parse-offer.js';

export function importOffers(filepath: string): void {
  const reader = createInterface({
    input: createReadStream(filepath, {encoding: 'utf8'}),
    crlfDelay: Infinity,
  });

  reader.on('line', (line) => {
    console.log(chalk.cyan(JSON.stringify(parseOffer(line), null, 2)));
  });

  reader.on('error', (error: Error) => {
    console.error(chalk.red(`Ошибка импорта: ${error.message}`));
    process.exitCode = 1;
  });
}
