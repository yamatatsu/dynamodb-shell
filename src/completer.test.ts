import Completer from "./completer";

const completer = new Completer();
completer.setTables(["users", "userItems", "user-meta", "payments"]);

test.each`
  line        | expected
  ${"."}      | ${[".exit", ".region"]}
  ${".re"}    | ${[".region"]}
  ${".rep"}   | ${[".exit", ".region"]}
  ${"db.#"}   | ${['db["#meta"]']}
  ${"db['#"}  | ${['db["#meta"]']}
  ${'db["#'}  | ${['db["#meta"]']}
  ${"db."}    | ${["db.users", "db.userItems", 'db["user-meta"]', "db.payments"]}
  ${"db["}    | ${["db.users", "db.userItems", 'db["user-meta"]', "db.payments"]}
  ${"db['"}   | ${["db.users", "db.userItems", 'db["user-meta"]', "db.payments"]}
  ${'db["'}   | ${["db.users", "db.userItems", 'db["user-meta"]', "db.payments"]}
  ${"db.u"}   | ${["db.users", "db.userItems", 'db["user-meta"]']}
  ${"db['u"}  | ${["db.users", "db.userItems", 'db["user-meta"]']}
  ${'db["u'}  | ${["db.users", "db.userItems", 'db["user-meta"]']}
  ${'db["uu'} | ${["db.users", "db.userItems", 'db["user-meta"]', "db.payments"]}
  ${"foo"}    | ${[]}
`('when given "$line", candidates is $expected', ({ line, expected }) => {
  const result = completer.complete(line);
  expect(result).toEqual([expected, line]);
});
