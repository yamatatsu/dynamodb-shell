import Dynamodb from "../dynamodb";
import createDB from "./";

jest.mock("../dynamodb");
const DynamodbMock = Dynamodb as jest.Mock;

const mockedDynamodbBase = {
  async listTables() {
    return ["user"];
  },
  async describeTable() {
    return {
      AttributeDefinitions: [
        { AttributeName: "pk", AttributeType: "S" },
        { AttributeName: "sk", AttributeType: "S" },
      ],
      TableName: "user",
      KeySchema: [
        { AttributeName: "pk", KeyType: "HASH" },
        { AttributeName: "sk", KeyType: "RANGE" },
      ],
      TableStatus: "ACTIVE",
      CreationDateTime: "2022-10-02T14:59:21.157000+09:00",
      ProvisionedThroughput: {
        NumberOfDecreasesToday: 0,
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      TableSizeBytes: 11,
      ItemCount: 1,
      TableArn: "arn:aws:dynamodb:us-east-1:123456789012:table/user",
      TableId: "F307A7E8-597F-4A56-9E1D-30DAF37890CB",
    };
  },
  async scan() {
    return [
      { pk: "userId:1", sk: "user", name: "foo" },
      { pk: "userId:1", sk: "room:1", color: "green" },
      { pk: "userId:1", sk: "room:2", color: "blue" },
    ];
  },
  async get() {
    return { pk: "userId:1", sk: "user", name: "foo" };
  },
};

beforeEach(() => {
  DynamodbMock.mockClear();
  DynamodbMock.mockImplementation(() => mockedDynamodbBase);
});

describe("scan()", () => {
  test("response items", async () => {
    const db = await createDB(new Dynamodb());
    const users = await db.user.scan();
    expect(users).toEqual([
      { pk: "userId:1", sk: "user", name: "foo" },
      { pk: "userId:1", sk: "room:1", color: "green" },
      { pk: "userId:1", sk: "room:2", color: "blue" },
    ]);
  });
});

describe("get()", () => {
  test("response an item", async () => {
    const db = await createDB(new Dynamodb());
    const users = await db.user.get("userId:1", "user");
    expect(users).toEqual({ pk: "userId:1", sk: "user", name: "foo" });

    // expect(DynamodbMock.mock.instances[0].get).toBeCalledWith({
    //   TableName: "user",
    //   pk: "userId:1",
    //   sk: "user",
    // });
  });

  test("throw error if no table description was got", async () => {
    DynamodbMock.mockImplementation(() => {
      return {
        ...mockedDynamodbBase,
        async describeTable() {
          return {};
        },
      };
    });
    const db = await createDB(new Dynamodb());

    await expect(db.user.get(1)).rejects.toThrow(
      "No PrimaryKey Info was responded."
    );
  });
});
