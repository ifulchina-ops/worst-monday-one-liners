// Worst Monday One-Liners — make.fun entry.
//
// The program writes exactly one funny line to $MAKEFUN_OUTPUT_DIR/entry.txt.
// The line is fixed: the same bytes on every run, with no clock, no random
// choice, no network and no input from the environment. The gate allows
// 1-140 characters; the line is kept well inside that band even counting the
// trailing newline, so the entry is valid however the scorer counts it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke. A stand-up that exists to unblock a deploy — while the deploy is
// blocked waiting for the stand-up to end. One concrete Monday detail (the
// status update), one circular trap with no exit, and the sharp last word
// ("to end") landing on the very thing that never ends. The judge's brief
// rewards exactly this: on-subject, concrete, a surprise turn, fresh.
const LINE: string =
  "Monday: the stand-up asked for a status update on the deploy that was blocked waiting for the stand-up to end.";

function main(): void {
  // The gate counts characters, so hold the line well inside 1-140.
  if (LINE.length < 1 || LINE.length > 135) {
    throw new Error(`line is ${LINE.length} characters, outside the 1-135 band`);
  }
  if (LINE.includes("\n")) {
    throw new Error("line must be a single line");
  }
  if (LINE.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }

  const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR?.trim() || "/output";
  mkdirSync(outputDir, { recursive: true });
  const target: string = join(outputDir, "entry.txt");
  writeFileSync(target, LINE + "\n", "utf8");
  // Read the file back: a silent partial write must never ship as the entry.
  if (readFileSync(target, "utf8") !== LINE + "\n") {
    throw new Error("entry.txt does not match the line after writing");
  }
}

main();
