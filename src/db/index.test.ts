import Dynamodb from "../dynamodb";
import createDB from "./";

const dynamodb = new Dynamodb({
  endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
  region: "local",
});

describe("scan()", () => {
  test("response items", async () => {
    const db = await createDB(dynamodb);
    const users = await db.users.scan();
    expect(users).toEqual([
      { pk: "userId:1", sk: "room:1", color: "green" },
      { pk: "userId:1", sk: "room:2", color: "blue" },
      { pk: "userId:1", sk: "user", name: "foo" },
    ]);
  });
});

describe("get()", () => {
  test("response an item", async () => {
    const db = await createDB(dynamodb);
    const item = db.users.get("userId:1", "user");
    await item.attributesPromise;
    expect(item.show()).toEqual({ pk: "userId:1", sk: "user", name: "foo" });
  });

  test("throw error if no table description was got", async () => {
    const dynamodb = new Dynamodb({
      endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
      region: "local",
    });
    jest.spyOn(dynamodb, "describeTable").mockReturnValue(Promise.resolve({}));

    const db = await createDB(dynamodb);

    const item = db.users.get(1);
    await item.attributesPromise;

    expect(item.show()).toThrow("No PrimaryKey Info was responded.");
  });
});
