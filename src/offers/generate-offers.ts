import {createWriteStream} from 'node:fs';
import {Readable, pipeline} from 'node:stream';
import got from 'got';
import chalk from 'chalk';
import {MockServerData} from '../types/mock-server-data.type.js';
import {generateOffer} from './generate-offer.js';
import {serializeOffer} from './serialize-offer.js';

function* generateRows(count: number, data: MockServerData): Generator<string> {
  for (let i = 0; i < count; i++) {
    yield `${serializeOffer(generateOffer(data))}\n`;
  }
}

export function generateOffers(count: number, filepath: string, url: string): void {
  const request = got.stream(url).setEncoding('utf8');
  let body = '';

  request.on('data', (chunk: string) => {
    body += chunk;
  });

  request.on('error', (error: Error) => {
    console.error(chalk.red(`Ошибка загрузки данных: ${error.message}`));
    process.exitCode = 1;
  });

  request.on('end', () => {
    try {
      const data = JSON.parse(body) as MockServerData;
      pipeline(Readable.from(generateRows(count, data)), createWriteStream(filepath), (error) => {
        if (error) {
          console.error(chalk.red(`Ошибка генерации: ${error.message}`));
          process.exitCode = 1;
          return;
        }
        console.log(chalk.green(`Сгенерировано предложений: ${count}. Файл: ${filepath}`));
      });
    } catch (error) {
      console.error(chalk.red(`Ошибка чтения данных сервера: ${(error as Error).message}`));
      process.exitCode = 1;
    }
  });
}
