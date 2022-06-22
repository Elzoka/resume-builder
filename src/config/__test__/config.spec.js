describe("config", () => {
  test("fetch env variables", async () => {
    const new_port = "5000";
    process.env.API_PORT = new_port;

    const { default: config } = await import("@/config");
    expect(config.port).toBe(new_port);
  });
});
