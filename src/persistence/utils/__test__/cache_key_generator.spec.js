import cache_key_generator from "../cache_key_generator";

test("cache_key_generator", () => {
  const model_name = "test";
  const id = "1234";

  expect(cache_key_generator(model_name, id)).toEqual(`${model_name}:${id}`);
});
