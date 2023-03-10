import { IDynamodb } from "../dynamodb";
import Item from "./item";

export default class Table {
  private pkName: string | null = null;
  private skName: string | null = null;

  constructor(
    private readonly dynamodb: IDynamodb,
    private readonly tableName: string
  ) {}

  public async scan(): Promise<object[] | null> {
    return this.dynamodb.scan(this.tableName);
  }

  public get(pk: string | number, sk?: string | number): Item {
    return new Item(
      (this.pkName ? Promise.resolve() : this.setupKeyName()).then(() => {
        const keys = { [this.pkName!]: pk };
        if (this.skName && sk) keys[this.skName] = sk;
        return this.dynamodb.get(this.tableName, keys);
      })
    );
  }

  private async setupKeyName() {
    const tableInfo = await this.dynamodb.describeTable(this.tableName);
    const pkName = tableInfo.KeySchema?.[0].AttributeName;
    const skName = tableInfo.KeySchema?.[1]?.AttributeName;

    if (!pkName) {
      throw new Error("No PrimaryKey Info was responded.");
    }
    this.pkName = pkName;
    this.skName = skName ?? null;
  }
}
