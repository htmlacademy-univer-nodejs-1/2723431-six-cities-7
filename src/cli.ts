import {readFileSync} from 'node:fs';
import chalk from 'chalk';
import {importOffers} from './offers/import-offers.js';

function showHelp(): void {
  console.log(chalk.cyan('Программа для подготовки данных сервиса «Шесть городов»'));
  console.log(`${chalk.yellow('--help')}              Показать справку`);
  console.log(`${chalk.yellow('--version')}           Показать версию приложения`);
  console.log(`${chalk.yellow('--import <filepath>')} Импортировать предложения из TSV`);
}

function showVersion(): void {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {version: string};
  console.log(chalk.green(packageJson.version));
}

export function runCLI(args: string[]): void {
  const [command, filepath] = args;

  switch (command) {
    case '--version':
      showVersion();
      break;
    case '--import':
      if (!filepath) {
        console.error(chalk.red('Укажите путь к TSV-файлу: --import <filepath>'));
        process.exitCode = 1;
        return;
      }
      importOffers(filepath);
      break;
    case '--help':
    default:
      showHelp();
  }
}
