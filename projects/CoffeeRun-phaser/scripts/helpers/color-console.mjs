
const ColorReset = '\x1b[0m';
const ColorRed = `\x1b[31m%s${ColorReset}`;
const ColorCyan = `\x1b[36m%s${ColorReset}`;

export const redLog = (message) => {
  console.log(ColorRed, message);
}

export const cyanLog = (message) => {
  console.log(ColorCyan, message);
}
