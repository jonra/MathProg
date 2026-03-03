import { describe, it, expect } from "vitest";
import { sourceToLatex } from "../src/math-render/parser";

describe("Math Rendering - sourceToLatex", () => {
  it("converts set declarations", () => {
    const blocks = sourceToLatex("set T;");
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("declaration");
    expect(blocks[0].latex).toContain("\\textbf{set}");
    expect(blocks[0].latex).toContain("T");
  });

  it("converts minimize objectives with sum", () => {
    const blocks = sourceToLatex(
      "minimize cost: sum{t in T} price[t] * grid[t];"
    );
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("objective");
    expect(blocks[0].latex).toContain("\\min");
    expect(blocks[0].latex).toContain("\\sum");
    expect(blocks[0].latex).toContain("\\in");
  });

  it("converts subscripts", () => {
    const blocks = sourceToLatex(
      "s.t. balance{t in T}: grid[t] = demand[t];"
    );
    expect(blocks).toHaveLength(1);
    expect(blocks[0].latex).toContain("grid_{t}");
    expect(blocks[0].latex).toContain("demand_{t}");
  });

  it("converts comparison operators", () => {
    const blocks = sourceToLatex("s.t. bound{t in T}: x[t] >= 0;");
    expect(blocks).toHaveLength(1);
    expect(blocks[0].latex).toContain("\\geq");
  });

  it("handles identifiers with underscores", () => {
    const blocks = sourceToLatex("param battery_cap := 50;");
    expect(blocks).toHaveLength(1);
    // Should use \textit with escaped underscore, not raw _
    expect(blocks[0].latex).toContain("\\textit{battery\\_cap}");
  });

  it("handles multiple statements", () => {
    const source = `set T;
param demand{t in T};
minimize cost: sum{t in T} price[t];`;
    const blocks = sourceToLatex(source);
    expect(blocks.length).toBeGreaterThanOrEqual(2);
  });

  it("skips comments and blank lines", () => {
    const source = `# This is a comment

set T;`;
    const blocks = sourceToLatex(source);
    expect(blocks).toHaveLength(1);
  });

  it("skips solve and display statements", () => {
    const source = `set T;
solve;
display: x;
end;`;
    const blocks = sourceToLatex(source);
    expect(blocks).toHaveLength(1); // Only the set decl
  });

  it("strips inline comments when collecting statements", () => {
    const source = `var soc{t in T} >= 0;  # State of charge
var grid{t in T} >= 0;  # Grid import`;
    const blocks = sourceToLatex(source);
    expect(blocks).toHaveLength(2);
    // Should NOT contain comment text in the LaTeX
    expect(blocks[0].latex).not.toContain("State of charge");
  });

  it("tracks line numbers", () => {
    const source = `set T;
param demand{t in T};`;
    const blocks = sourceToLatex(source);
    expect(blocks[0].fromLine).toBe(1);
    expect(blocks[1].fromLine).toBe(2);
  });

  it("handles multi-line statements", () => {
    const source = `s.t. balance{t in T}:
    grid[t] + solar[t]
    = demand[t];`;
    const blocks = sourceToLatex(source);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("constraint");
    expect(blocks[0].latex).toContain("grid_{t}");
  });

  it("converts multiplication to cdot", () => {
    const blocks = sourceToLatex(
      "minimize cost: sum{t in T} price[t] * grid[t];"
    );
    expect(blocks[0].latex).toContain("\\cdot");
  });
});
