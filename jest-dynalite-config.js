module.exports = {
  tables: [
    {
      TableName: "users",
      KeySchema: [
        { AttributeName: "pk", KeyType: "HASH" },
        { AttributeName: "sk", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "pk", AttributeType: "S" },
        { AttributeName: "sk", AttributeType: "S" },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      data: [
        { pk: "userId:1", sk: "user", name: "foo" },
        { pk: "userId:1", sk: "room:1", color: "green" },
        { pk: "userId:1", sk: "room:2", color: "blue" },
      ],
    },
  ],
  basePort: 8000,
};
