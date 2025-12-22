import P5 from "p5";

declare global {
  // 1. This handles 'new p5(...)'
  const p5: typeof P5;

  // 2. This handles the type 'p: p5'
  interface p5 extends P5 {}
}

export {};
