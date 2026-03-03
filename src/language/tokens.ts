import { ExternalTokenizer } from "@lezer/lr";
// These will be generated - import token IDs
import { subjectTo, notIn } from "./mathprog.grammar.terms";

// External tokenizer for "s.t." and "subject to" keywords
// These are tricky because "s.t." contains dots (conflict with number parsing)
// and "subject to" is two words
export const subjectToTokenizer = new ExternalTokenizer((input) => {
  // Try "s.t."
  if (
    input.next === 115 /* s */ &&
    input.peek(1) === 46 /* . */ &&
    input.peek(2) === 116 /* t */ &&
    input.peek(3) === 46 /* . */
  ) {
    // Make sure next char is whitespace or colon (not part of an identifier)
    const after = input.peek(4);
    if (
      after === -1 ||
      after === 32 ||
      after === 9 ||
      after === 10 ||
      after === 13 ||
      after === 58 /* : */
    ) {
      input.advance(4);
      input.acceptToken(subjectTo);
      return;
    }
  }

  // Try "subject to"
  const subjectToStr = "subject to";
  let match = true;
  for (let i = 0; i < subjectToStr.length; i++) {
    if (input.peek(i) !== subjectToStr.charCodeAt(i)) {
      match = false;
      break;
    }
  }
  if (match) {
    const after = input.peek(subjectToStr.length);
    if (
      after === -1 ||
      after === 32 ||
      after === 9 ||
      after === 10 ||
      after === 13 ||
      after === 58
    ) {
      input.advance(subjectToStr.length);
      input.acceptToken(subjectTo);
      return;
    }
  }

  // Try "not in"
  const notInStr = "not in";
  match = true;
  for (let i = 0; i < notInStr.length; i++) {
    if (input.peek(i) !== notInStr.charCodeAt(i)) {
      match = false;
      break;
    }
  }
  if (match) {
    const after = input.peek(notInStr.length);
    if (
      after === -1 ||
      after === 32 ||
      after === 9 ||
      after === 10 ||
      after === 13
    ) {
      input.advance(notInStr.length);
      input.acceptToken(notIn);
      return;
    }
  }
});
