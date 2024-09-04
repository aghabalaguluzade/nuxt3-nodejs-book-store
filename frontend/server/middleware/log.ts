import chalk from 'chalk';

export default defineEventHandler((event) => {
   console.info(chalk.underline.bgBlue.bold('New request: ' + getRequestURL(event)))
}) 