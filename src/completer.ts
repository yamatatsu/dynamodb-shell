import { CompleterResult } from "node:readline";

export default class Completer {
  private tables: string[] = [];

  public complete(line: string): CompleterResult {
    if (line.startsWith(".")) {
      const completions = [".exit", ".region", ".hoge"];
      const hits = completions.filter((c) => c.startsWith(line));
      return [hits.length ? hits : completions, line];
    }

    if (line.startsWith("db.t[") || line.startsWith("db.tables[")) {
      const [, tableAttr, subTableName] =
        line.match(/^db\.(t|tables)\[['"]?([a-zA-Z0-9_.-]*)/) ?? [];
      const hits = this.tables.filter((c) => c.startsWith(subTableName));
      const candidates = hits.map((table) => `db.${tableAttr}["${table}"]`);
      return [candidates, line];
    }

    if (line.startsWith("db.")) {
      const completions = ["db.t", "db.tables", "db.tn", "db.tableNames"];
      const hits = completions.filter((c) => c.startsWith(line));
      return [hits.length ? hits : completions, line];
    }

    return [[], line];
  }

  public setTables(tables: string[]): void {
    this.tables = tables;
  }
}
