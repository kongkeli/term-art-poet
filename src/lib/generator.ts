import chalk from "chalk";

export function generatePattern(
  seedInput: string,
  width = 20,
  height = 10
): string[] {
  // εξασφαλίζουμε ότι πάντα είναι string
  const seed = String(seedInput ?? "");

  const result: string[] = [];
  let s = 0;

  // απλό "hash" του seed για σταθερό pattern
  for (let i = 0; i < seed.length; i++) s += seed.charCodeAt(i);

  const chars = [".", ",", ":", ";", "*", "+", "#"];
  const colors = [
    chalk.gray,
    chalk.white,
    chalk.green,
    chalk.cyan,
    chalk.blue,
    chalk.magenta,
    chalk.yellow,
  ];

  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      const value = (x * y + s) % chars.length;
      const ch = chars[value];
      const colorFn = colors[value];
      line += colorFn(ch);
    }
    result.push(line);
  }

  return result;
}
