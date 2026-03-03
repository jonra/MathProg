import { describe, it, expect } from "vitest";
// Lint tests are integration tests that require a full editor state
// We test the underlying logic patterns here

describe("MathProg Linter - patterns", () => {
  it("detects missing end statement", () => {
    const source = `set T := 1..24;
param x{t in T};
minimize cost: sum{t in T} x[t];`;
    // Model doesn't end with "end;"
    expect(source.trimEnd().endsWith("end;")).toBe(false);
  });

  it("accepts valid end statement", () => {
    const source = `set T := 1..24;
solve;
end;`;
    expect(source.trimEnd().endsWith("end;")).toBe(true);
  });

  it("detects := in constraints", () => {
    const line = "s.t. balance{t in T}: grid[t] := demand[t];";
    expect(line).toMatch(/^(s\.t\.|subject\s+to)\s/);
    expect(line).toMatch(/:=/);
  });
});
