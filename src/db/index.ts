import { IDynamodb } from "../dynamodb";
import Table from "./table";

type IDB = {
  "#meta": { tableNames: string[] };
} & { [tableName: string]: Table };

export default async function createDB(dynamodb: IDynamodb) {
  const tableNames = await dynamodb.listTables();
  const db = tableNames.reduce(
    (acc, name) => {
      acc[name] = new Table(dynamodb, name);
      return acc;
    },
    { "#meta": { tableNames } } as IDB
  );

  return db;
}
