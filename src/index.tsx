import React from "react";
import { render, Box, Text } from "ink";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generatePattern } from "./lib/generator";
import { makeHaiku } from "./lib/poetry";

type Args = {
  seed: string;
};

const argv = yargs(hideBin(process.argv))
  .option("seed", { type: "string", demandOption: true })
  .parseSync() as Args;

const rawSeed = argv.seed;
const seed = Array.isArray(rawSeed) ? rawSeed[0] : String(rawSeed ?? "");

const pattern = generatePattern(seed);
const haiku = makeHaiku(seed);

const App: React.FC = () => (
  <Box flexDirection="column">
    <Text>
      Seed: <Text color="green">{seed}</Text>
    </Text>

    <Box marginTop={1} flexDirection="column">
      {pattern.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>

    <Box marginTop={1} flexDirection="column">
      <Text color="gray">--- Haiku ---</Text>
      {haiku.split("\n").map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>
  </Box>
);

render(<App />);
