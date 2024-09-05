import chalk from 'chalk';

export default defineEventHandler((event) => {
   console.info(chalk.underline.bgGreen.bold('New request: ' + getRequestURL(event)))
}) 