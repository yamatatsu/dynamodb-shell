import { IDynamodb } from "../dynamodb";
import Table from "./table";

export default async function createDB(dynamodb: IDynamodb) {
  const tableNames = await dynamodb.listTables();
  const tables = tableNames.reduce<{ [tableName: string]: Table }>(
    (acc, name) => {
      acc[name] = new Table(dynamodb, name);
      return acc;
    },
    {}
  );

  return {
    get tables() {
      return tables;
    },
    get t() {
      return tables;
    },
    get tableNames() {
      return tableNames;
    },
    get tn() {
      return tableNames;
    },
  };
}
