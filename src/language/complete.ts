import {
  CompletionContext,
  CompletionResult,
  Completion,
} from "@codemirror/autocomplete";

const keywords: Completion[] = [
  { label: "set", type: "keyword", detail: "Set declaration" },
  { label: "param", type: "keyword", detail: "Parameter declaration" },
  { label: "var", type: "keyword", detail: "Variable declaration" },
  { label: "minimize", type: "keyword", detail: "Objective (minimize)" },
  { label: "maximize", type: "keyword", detail: "Objective (maximize)" },
  { label: "s.t.", type: "keyword", detail: "Subject to (constraint)" },
  { label: "subject to", type: "keyword", detail: "Subject to (constraint)" },
  { label: "solve", type: "keyword", detail: "Solve the model" },
  { label: "check", type: "keyword", detail: "Check assertion" },
  { label: "display", type: "keyword", detail: "Display values" },
  { label: "printf", type: "keyword", detail: "Formatted print" },
  { label: "for", type: "keyword", detail: "For loop" },
  { label: "if", type: "keyword", detail: "Conditional" },
  { label: "then", type: "keyword", detail: "Then clause" },
  { label: "else", type: "keyword", detail: "Else clause" },
  { label: "end", type: "keyword", detail: "End of model" },
  { label: "data", type: "keyword", detail: "Data section" },
  { label: "in", type: "keyword", detail: "Set membership" },
  { label: "not", type: "keyword", detail: "Logical not" },
  { label: "and", type: "keyword", detail: "Logical and" },
  { label: "or", type: "keyword", detail: "Logical or" },
  { label: "union", type: "keyword", detail: "Set union" },
  { label: "inter", type: "keyword", detail: "Set intersection" },
  { label: "diff", type: "keyword", detail: "Set difference" },
  { label: "symdiff", type: "keyword", detail: "Symmetric difference" },
  { label: "cross", type: "keyword", detail: "Cartesian product" },
  { label: "within", type: "keyword", detail: "Set containment" },
  { label: "default", type: "keyword", detail: "Default value" },
  { label: "dimen", type: "keyword", detail: "Set dimension" },
  { label: "integer", type: "keyword", detail: "Integer type" },
  { label: "binary", type: "keyword", detail: "Binary type" },
  { label: "symbolic", type: "keyword", detail: "Symbolic type" },
  { label: "div", type: "keyword", detail: "Integer division" },
  { label: "mod", type: "keyword", detail: "Modulo" },
  { label: "Infinity", type: "constant", detail: "Positive infinity" },
];

const aggregates: Completion[] = [
  { label: "sum", type: "function", detail: "Summation", apply: "sum{} " },
  { label: "prod", type: "function", detail: "Product", apply: "prod{} " },
  { label: "min", type: "function", detail: "Minimum", apply: "min{} " },
  { label: "max", type: "function", detail: "Maximum", apply: "max{} " },
  { label: "forall", type: "function", detail: "Universal quantifier" },
  { label: "exists", type: "function", detail: "Existential quantifier" },
  { label: "setof", type: "function", detail: "Set builder" },
  { label: "count", type: "function", detail: "Count elements" },
];

const builtins: Completion[] = [
  { label: "abs", type: "function", detail: "Absolute value", apply: "abs(" },
  { label: "ceil", type: "function", detail: "Ceiling", apply: "ceil(" },
  { label: "floor", type: "function", detail: "Floor", apply: "floor(" },
  { label: "exp", type: "function", detail: "Exponential", apply: "exp(" },
  { label: "log", type: "function", detail: "Natural log", apply: "log(" },
  { label: "log10", type: "function", detail: "Base-10 log", apply: "log10(" },
  { label: "sqrt", type: "function", detail: "Square root", apply: "sqrt(" },
  { label: "sin", type: "function", detail: "Sine", apply: "sin(" },
  { label: "cos", type: "function", detail: "Cosine", apply: "cos(" },
  { label: "atan", type: "function", detail: "Arctangent", apply: "atan(" },
  { label: "atan2", type: "function", detail: "Two-arg arctangent", apply: "atan2(" },
  { label: "round", type: "function", detail: "Round", apply: "round(" },
  { label: "trunc", type: "function", detail: "Truncate", apply: "trunc(" },
  { label: "card", type: "function", detail: "Set cardinality", apply: "card(" },
  { label: "length", type: "function", detail: "String length", apply: "length(" },
  { label: "substr", type: "function", detail: "Substring", apply: "substr(" },
  { label: "str2time", type: "function", detail: "String to time", apply: "str2time(" },
  { label: "time2str", type: "function", detail: "Time to string", apply: "time2str(" },
  { label: "gmtime", type: "function", detail: "Current time", apply: "gmtime(" },
  { label: "Irand224", type: "function", detail: "Random integer", apply: "Irand224(" },
  { label: "Uniform01", type: "function", detail: "Uniform [0,1]", apply: "Uniform01(" },
  { label: "Uniform", type: "function", detail: "Uniform [a,b]", apply: "Uniform(" },
  { label: "Normal01", type: "function", detail: "Standard normal", apply: "Normal01(" },
  { label: "Normal", type: "function", detail: "Normal(μ,σ)", apply: "Normal(" },
];

const allCompletions = [...keywords, ...aggregates, ...builtins];

export function mathProgCompletion(
  context: CompletionContext
): CompletionResult | null {
  const word = context.matchBefore(/[a-zA-Z_]\w*/);
  if (!word && !context.explicit) return null;

  return {
    from: word ? word.from : context.pos,
    options: allCompletions,
    validFor: /^[a-zA-Z_]\w*$/,
  };
}
