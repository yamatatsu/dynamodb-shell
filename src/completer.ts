import { CompleterResult } from "node:readline";

export default class Completer {
  private tables: string[] = [];

  public complete(line: string): CompleterResult {
    if (line.startsWith(".")) {
      const completions = [".exit", ".region", ".hoge"];
      const hits = completions.filter((c) => c.startsWith(line));
      return [hits.length ? hits : completions, line];
    }

    if (
      line.startsWith("db.#") ||
      line.startsWith("db['#") ||
      line.startsWith('db["#')
    ) {
      return [['db["#meta"]'], line];
    }

    if (line.startsWith("db[") || line.startsWith("db[")) {
      const [, subTableName] = line.match(/^db\[['"]?([a-zA-Z0-9_.-]*)/) ?? [];
      const hits = this.tables.filter((c) => c.startsWith(subTableName));
      const candidates = hits.map((table) => `db["${table}"]`);
      return [candidates, line];
    }

    if (line.startsWith("db.")) {
      const [, subTableName] = line.match(/^db\.([a-zA-Z0-9_.-]*)/) ?? [];
      const hits = this.tables.filter((c) => c.startsWith(subTableName));
      const candidates = hits.map((table) =>
        /[a-zA-Z_][[a-zA-Z0-9_]*]/.test(table)
          ? `db.${table}`
          : `db["${table}"]`
      );
      return [candidates, line];
    }

    return [[], line];
  }

  public setTables(tables: string[]): void {
    this.tables = tables;
  }
}
