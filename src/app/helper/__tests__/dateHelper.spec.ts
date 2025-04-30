import { adjustToEndOfDay, adjustToStartOfDay } from "../dateHelper";

describe("Date Helper", () => {
  it("should adjust to end of day", () => {
    const date = new Date("2021-01-01T00:00:00Z");
    const adjustedDate = adjustToEndOfDay(date.toISOString());

    // 2021-01-01T00:00:00Z - 3h = 2020-12-31T21:00:00.000Z (UTC -3 , Brazil)
    expect(adjustedDate.toISOString()).toBe("2021-01-01T20:59:59.999Z");
  });

  it("should adjust to start of day", () => {
    const date = new Date("2021-01-01T00:00:00Z");
    const adjustedDate = adjustToStartOfDay(date.toISOString());

    // 2021-01-01T00:00:00Z - 3h = 2020-12-31T21:00:00.000Z (UTC -3 , Brazil)
    expect(adjustedDate.toISOString()).toBe("2020-12-31T21:00:00.000Z");
  });
});
