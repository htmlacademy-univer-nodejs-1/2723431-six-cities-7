import {readFileSync} from 'node:fs';
import chalk from 'chalk';
import {importOffers} from './offers/import-offers.js';
import {generateOffers} from './offers/generate-offers.js';

function showHelp(): void {
  console.log(chalk.cyan('Программа для подготовки данных сервиса «Шесть городов»'));
  console.log(`${chalk.yellow('--help')}              Показать справку`);
  console.log(`${chalk.yellow('--version')}           Показать версию приложения`);
  console.log(`${chalk.yellow('--import <filepath>')} Импортировать предложения из TSV`);
  console.log(`${chalk.yellow('--generate <n> <filepath> <url>')} Сгенерировать предложения в TSV`);
}

function showVersion(): void {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {version: string};
  console.log(chalk.green(packageJson.version));
}

export function runCLI(args: string[]): void {
  const [command, ...parameters] = args;

  switch (command) {
    case '--version':
      showVersion();
      break;
    case '--import': {
      const [filepath] = parameters;
      if (!filepath) {
        console.error(chalk.red('Укажите путь к TSV-файлу: --import <filepath>'));
        process.exitCode = 1;
        return;
      }
      importOffers(filepath);
      break;
    }
    case '--generate': {
      const [amount, outputPath, url] = parameters;
      const count = Number(amount);
      if (!Number.isSafeInteger(count) || count < 1 || !outputPath || !url) {
        console.error(chalk.red('Укажите количество, путь и URL: --generate <n> <filepath> <url>'));
        process.exitCode = 1;
        return;
      }
      generateOffers(count, outputPath, url);
      break;
    }
    case '--help':
    default:
      showHelp();
  }
}
