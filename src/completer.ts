import { CompleterResult } from "node:readline";

export default class Completer {
  private tables: string[] = [];

  public complete(line: string): CompleterResult {
    if (line.startsWith(".")) {
      const completions = [".exit", ".region"];
      const candidates = completions.filter((c) => c.startsWith(line));
      return [candidates.length ? candidates : completions, line];
    }

    if (
      line.startsWith("db.#") ||
      line.startsWith("db['#") ||
      line.startsWith('db["#')
    ) {
      return [['db["#meta"]'], line];
    }

    const [, , subTableName] =
      line.match(/^db(\.|\[['"]?)([a-zA-Z0-9_.-]*)/) ?? [];
    if (subTableName != null) {
      const hits = this.tables.filter((c) => c.startsWith(subTableName));
      const candidates = hits.map((table) =>
        /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)
          ? `db.${table}`
          : `db["${table}"]`
      );
      return [
        (hits.length ? hits : this.tables).map((table) =>
          /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)
            ? `db.${table}`
            : `db["${table}"]`
        ),
        line,
      ];
    }

    return [[], line];
  }

  public setTables(tables: string[]): void {
    this.tables = tables;
  }
}
