- [x] research interface node:repl
- [x] [usecase] get table
- [x] [usecase] scan items
- [x] [usecase] get item
- [x] [usecase] autocomplete table name
- [x] test
- [ ] [usecase] save item
- [ ] [usecase] use profile
- [ ] [usecase] copy
- [ ] [usecase] save global var
- [ ] [usecase] update item

```js
.region us-east-1
// "ap-northeast-1"

db.t["deviceTable"].scan();
// [
//   { deviceId: "deviceId|111", name: "foo" },
//   { deviceId: "deviceId|222", name: "bar" },
//   { deviceId: "deviceId|333", name: "buz" }
// ]

device1 = db.t["deviceTable"].get("deviceId|111");
// { deviceId: "deviceId|111", name: "foo" }

device1.name = "foobar";
// "foobar"

device1;
// { deviceId: "deviceId|111", name: "foobar" }

device1.save();
// { result: "success" }
```

## Development

```
pnpm i
```

```
pnpm start
```

```
pnpm build
```
