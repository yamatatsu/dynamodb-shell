import * as repl from "node:repl";
import Dynamodb from "./dynamodb";
import createDB from "./db";
import Completer from "./completer";
import { ALL_REGIONS } from "./constants";

startREPL().catch((err) => {
  console.error(err);
});

async function startREPL() {
  const completer = new Completer();
  const dynamodb = new Dynamodb();
  const region = await dynamodb.getRegion();

  const server = repl.start({
    prompt: getPrompt(region),
    completer: (line: string) => completer.complete(line),
  });

  server.defineCommand("region", async (region) => {
    const _region = region.trim();
    if (!ALL_REGIONS.includes(_region)) {
      return;
    }

    const dynamodb = new Dynamodb(_region);
    const db = await createDB(dynamodb);

    server.setPrompt(getPrompt(_region));
    server.context.db = db;
    completer.setTables(db.tableNames);

    server.displayPrompt();
  });

  const db = await createDB(dynamodb);
  server.context.db = db;
  completer.setTables(db.tableNames);
}

function getPrompt(region: string) {
  return `dynamodb-shell[${region}] > `;
}
