import {
  DescribeTableCommand,
  DynamoDBClient,
  ListTablesCommand,
  TableDescription,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export interface IDynamodb {
  listTables(): Promise<string[]>;
  describeTable(tableName: string): Promise<TableDescription>;
  scan(tableName: string): Promise<Record<string, any>[]>;
  get(
    tableName: string,
    key: { [key: string]: string | number }
  ): Promise<Record<string, any> | null>;
}

export default class Dynamodb implements IDynamodb {
  private readonly client: DynamoDBClient;
  private readonly document: DynamoDBDocument;

  constructor(region?: string) {
    this.client = new DynamoDBClient({ region });
    this.document = DynamoDBDocument.from(this.client);
  }

  public async getRegion(): Promise<string> {
    const { region } = this.client.config;
    if (typeof region === "string") {
      return region;
    }
    return region();
  }

  public async listTables(): Promise<string[]> {
    // TODO: recursively
    const output = await this.client.send(new ListTablesCommand({}));
    return output.TableNames ?? [];
  }

  public async describeTable(tableName: string): Promise<TableDescription> {
    const output = await this.client.send(
      new DescribeTableCommand({ TableName: tableName })
    );
    if (!output.Table) {
      throw new Error("No table was found.");
    }
    return output.Table;
  }

  public async scan(tableName: string) {
    const output = await this.document.scan({ TableName: tableName });
    return output.Items ?? [];
  }

  public async get(tableName: string, key: { [key: string]: string | number }) {
    const output = await this.document.get({ TableName: tableName, Key: key });
    return output.Item ?? null;
  }
}
