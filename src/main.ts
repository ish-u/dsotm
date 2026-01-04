import type { Graphics } from "p5";
import "./style.css";

export const SPEAK_TO_ME = (p5: p5) => {
  p5.setup = () => {
    p5.createCanvas(p5.windowHeight, p5.windowHeight);
  };

  p5.draw = () => {
    p5.background(0);

    p5.translate(p5.width / 2, p5.height / 1.5);

    let x1 = -p5.width / 4;
    let y1 = 0;
    let x2 = p5.width / 4;
    let y2 = 0;
    let x3 = 0;
    let y3 = -p5.height / 2.25;

    let A = p5.createVector(x2, y2);
    let B = p5.createVector(x3, y3);
    let mid = A.copy().add(B.copy()).mult(0.5);
    let dir = B.copy().sub(A.copy()).normalize();
    let innerTriangleTop = mid.copy().add(dir.copy().mult(mid.mag() / 3));
    let innerTriangleBottom = mid.copy().add(dir.copy().mult(-mid.mag() / 6));

    // RIGHT RAYS
    let rightRaysColors = [
      [128, 0, 128], // V
      [2, 197, 242], // B
      [103, 206, 0], // G
      [255, 255, 0], // Y
      [255, 128, 0], // O
      [255, 0, 0], // R
    ];
    rightRaysColors.reverse();
    let rayWidth =
      innerTriangleTop.copy().sub(innerTriangleBottom.copy()).mag() /
      rightRaysColors.length;
    for (let i = 0; i < rightRaysColors.length; i++) {
      let rayColor = rightRaysColors[i];
      p5.push();
      p5.noStroke();
      p5.fill(rayColor[0], rayColor[1], rayColor[2]);
      p5.translate(innerTriangleTop.copy().add(dir.copy().mult(-rayWidth * i)));
      p5.rotate(-p5.PI / 2.25);
      p5.rect(-rayWidth, 0, rayWidth / 1.2, p5.height);
      p5.pop();
    }

    // MAIN TRIANGLE
    p5.push();
    p5.noStroke();
    p5.triangle(x1, y1, x2, y2, x3, y3);
    p5.fill(0);
    p5.drawingContext.filter = "blur(15px)";
    p5.triangle(x1 + 10, y1 - 5, x2 - 10, y2 - 5, x3, y3 + 10);
    p5.pop();

    // INNER TRIANGLE
    p5.push();
    let gradient = p5.drawingContext.createLinearGradient(
      (x1 + x3) / 2,
      (y1 + y3) / 2,
      innerTriangleTop.x,
      innerTriangleTop.y,

      innerTriangleBottom.x,
      innerTriangleBottom.y,
    );
    gradient.addColorStop(0.25, "rgb(254 255 255 / 80%)");
    gradient.addColorStop(0.5, "rgb(100 130 140 / 50%)");
    gradient.addColorStop(1, "rgb(0 0 0 / 25%)");
    p5.drawingContext.fillStyle = gradient;
    p5.noStroke();
    p5.triangle(
      (x1 + x3) / 2,
      (y1 + y3) / 2,
      innerTriangleTop.x,
      innerTriangleTop.y,
      innerTriangleBottom.x,
      innerTriangleBottom.y,
    );
    p5.pop();

    // LEFT RAYS
    p5.push();
    p5.noStroke();
    p5.fill(255);
    p5.translate((x1 + x3) / 2, (y1 + y3) / 2);
    p5.rotate(p5.PI / 2.75);
    p5.rect(0.5, -5, 2.5, p5.height);
    p5.pop();

    // Overlay
    p5.push();
    p5.noFill();
    p5.stroke(100, 130, 140);
    p5.strokeWeight(7.5);
    p5.drawingContext.filter = "blur(12.5px)";
    p5.triangle(x1 + 20, y1 - 10, x2 - 20, y2 - 10, x3, y3 + 20);
    p5.pop();
  };
};

export const BREATH_IN_THE_AIR = (p5: p5) => {
  let shapeSize = 25;
  let palette = [
    [128, 0, 128], // V
    [2, 197, 242], // B
    [103, 206, 0], // G
    [255, 255, 0], // Y
    [255, 128, 0], // O
    [255, 0, 0], // R
  ];
  let colors: any = [];
  let oldColors: any = [];

  let x = 0.1;
  let y = 0.07;
  let z = 0;

  let transitioning = false;
  let transitionT = 1;

  function resetColors() {
    oldColors = structuredClone(colors);
    colors = [];
    for (let i = 0; i < p5.width; i += shapeSize) {
      let row = [];
      for (let j = 0; j < p5.width; j += shapeSize) {
        row.push(p5.random(palette));
      }
      colors.push(row);
    }
    transitionT = 0;
    transitioning = true;
  }

  p5.setup = () => {
    p5.createCanvas(p5.windowHeight, p5.windowHeight);

    for (let i = 0; i < p5.width; i += shapeSize) {
      let row = [];
      for (let j = 0; j < p5.width; j += shapeSize) {
        row.push(p5.random(palette));
      }
      colors.push(row);
    }

    oldColors = structuredClone(colors);
  };

  p5.draw = () => {
    p5.background(0);

    if (transitioning) {
      transitionT += 0.015;
      if (transitionT >= 1) {
        transitionT = 1;
        transitioning = false;
      }
    }

    if (p5.frameCount % 300 === 0) {
      resetColors();
    }

    for (let i = 0; i < p5.width; i += shapeSize) {
      for (let j = 0; j < p5.width; j += shapeSize) {
        let color = p5.lerpColor(
          p5.color(
            oldColors[i / shapeSize][j / shapeSize][0],
            oldColors[i / shapeSize][j / shapeSize][1],
            oldColors[i / shapeSize][j / shapeSize][2],
          ),
          p5.color(
            colors[i / shapeSize][j / shapeSize][0],
            colors[i / shapeSize][j / shapeSize][1],
            colors[i / shapeSize][j / shapeSize][2],
          ),
          transitionT,
        );
        p5.stroke(color);
        p5.strokeWeight(2);
        p5.noFill();
        let size =
          shapeSize * p5.noise((i * x) / shapeSize, (j * y) / shapeSize, z);

        size /= 1.25;

        let cX = i + shapeSize / 2;
        let cY = j + shapeSize / 2;

        let x1 = size * p5.cos(0);
        let y1 = size * p5.sin(0);

        let x2 = size * p5.cos((2 * p5.PI) / 3);
        let y2 = size * p5.sin((2 * p5.PI) / 3);

        let x3 = size * p5.cos((4 * p5.PI) / 3);
        let y3 = size * p5.sin((4 * p5.PI) / 3);

        p5.push();
        p5.translate(cX, cY);

        if (i % 2 === 0) {
          p5.rotate(p5.PI / 2);
        } else {
          p5.rotate(-p5.PI / 2);
        }

        p5.triangle(x1, y1, x2, y2, x3, y3);
        p5.pop();
      }
    }
    z = p5.frameCount * 0.01;
  };
};

export const ON_THE_RUN = (p5: p5) => {
  let palette = [
    [128, 0, 128], // V
    [2, 197, 242], // B
    [103, 206, 0], // G
    [255, 255, 0], // Y
    [255, 128, 0], // O
    [255, 0, 0], // R
  ];

  class Walker {
    x: number;
    y: number;
    c: number[];
    constructor(c: number[]) {
      this.x = 0;
      this.y = 0;
      this.c = c;
    }

    move() {
      this.x += p5.random(-2, 2);
      this.y += p5.random(-2, 2);
      p5.stroke(p5.color(this.c[0], this.c[1], this.c[2]));
      p5.strokeWeight(10);
      p5.point(this.x, this.y);
      if (this.x > p5.height / 2 || this.x < -p5.height / 2) {
        this.x = 0;
      }

      if (this.y > p5.height / 2 || this.y < -p5.height / 2) {
        this.y = 0;
      }
    }
  }

  const walkers: Walker[] = [];

  p5.setup = () => {
    p5.createCanvas(p5.windowHeight, p5.windowHeight);
    p5.background(0);
    for (let i = 0; i < 6; i++) {
      walkers.push(new Walker(palette[i]));
    }
  };

  p5.draw = () => {
    p5.translate(p5.height / 2, p5.width / 2);
    for (const walker of walkers) {
      walker.move();
    }
  };
};

export const TIME = (p5: p5) => {
  let angle = 0;
  let circleSize = 144;
  let offsets: number[][] = [];
  let camX = 0;
  let camY = 0;

  let cols = Math.ceil(p5.width / circleSize) + 2;
  let rows = Math.ceil(p5.height / circleSize) + 2;

  p5.setup = () => {
    p5.createCanvas(p5.windowHeight, p5.windowHeight);
    p5.angleMode(p5.DEGREES);

    cols = Math.ceil(p5.width / circleSize) + 2;
    rows = Math.ceil(p5.height / circleSize) + 2;

    for (let i = 0; i < cols; i++) {
      let row: number[] = [];
      for (let j = 0; j < rows; j++) {
        row.push(p5.random(0, 360));
      }
      offsets.push(row);
    }
  };

  p5.draw = () => {
    p5.background(0);

    let startCol = Math.floor(camX / circleSize);
    let startRow = Math.floor(camY / circleSize);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let tileX = startCol + i;
        let tileY = startRow + j;

        let x = tileX * circleSize - camX;
        let y = tileY * circleSize - camY;

        let ix = ((tileX % cols) + cols) % cols;
        let iy = ((tileY % rows) + rows) % rows;

        let offset = 100 + offsets[ix][iy];

        p5.push();
        p5.translate(x + circleSize / 2, y + circleSize / 2);

        p5.circle(0, 0, circleSize - 20);

        p5.push();
        p5.fill(0);
        p5.circle(0, 0, circleSize / 12);
        p5.pop();

        p5.push();
        p5.fill(0);
        p5.rotate(offset * 2 + angle);
        p5.rectMode(p5.CENTER);
        p5.rect(circleSize / 4 - 5, 0, circleSize / 2 - 10, 0.5);
        p5.pop();

        p5.push();
        p5.fill(0);
        p5.rotate(offset + angle / 25);
        p5.rectMode(p5.CENTER);
        p5.rect(circleSize / 4 - 7.5, 0, circleSize / 2 - 15, 2);
        p5.pop();

        p5.push();
        p5.fill(0);
        p5.rotate(offset / 2 + angle / 50);
        p5.rectMode(p5.CENTER);
        p5.rect(circleSize / 4 - 10, 0, circleSize / 2 - 20, 4);
        p5.pop();

        p5.pop();
      }
    }

    camX += 0.5;
    camY += 0.5;
    angle += 0.25;
  };
};

export const GREATEST_GIG = (p5: p5) => {
  let t = 0;

  function drawSpiral(phi: number) {
    p5.rotate(p5.frameCount);

    p5.beginShape();
    for (let i = 0; i < 360 * 4; i++) {
      let a = 1.8 * 16.18;
      let radius = a * p5.pow(phi, i / 90);
      let x = radius * p5.cos(i);
      let y = radius * -p5.sin(i);
      p5.vertex(x, y);
      if (i === 0) {
        p5.push();
        p5.fill(255);
        p5.circle(x, y, 16.8 / 3);
        p5.pop();
      }
    }
    p5.endShape();
    p5.fill(255);
    p5.circle(0, 0, 16.18);
  }

  p5.setup = () => {
    p5.createCanvas(p5.windowHeight, p5.windowHeight);
    p5.angleMode(p5.DEGREES);
  };

  p5.draw = () => {
    p5.background(0);
    p5.stroke(255);
    p5.strokeWeight(2.5);
    p5.noFill();

    p5.translate(p5.width / 2, p5.height / 2);

    for (let r = 0; r < 10; r++) {
      p5.push();
      p5.scale(1 + t * 0.2);
      p5.rotate(r * 36);
      drawSpiral(1 + p5.sqrt(5) / 2);
      p5.pop();
    }

    t += 0.0001;
  };
};

export const MONEY = (p5: p5) => {
  let spacing = 3;
  let circleSize = 24;
  let currencies = ["$", "€", "£", "¥", "₹", "₿"];
  let currencyGraphics: Graphics[] = [];

  p5.setup = () => {
    p5.createCanvas(p5.windowHeight, p5.windowHeight);
    p5.angleMode(p5.DEGREES);
    p5.smooth();
    for (const currency of currencies) {
      let currencyGraphic = p5.createGraphics(64, 64);
      currencyGraphic.textAlign(p5.CENTER, p5.CENTER);
      currencyGraphic.textSize(32);
      currencyGraphic.noStroke();
      currencyGraphic.fill("#8A6F1D");
      currencyGraphic.circle(32, 32, 64);
      currencyGraphic.fill(212, 175, 55);
      currencyGraphic.circle(32, 32, 56);
      currencyGraphic.fill("#8A6F1D");
      currencyGraphic.text(currency, 32, 32);
      currencyGraphics.push(currencyGraphic);
    }
    p5.imageMode(p5.CENTER);
  };

  p5.draw = () => {
    p5.background(0);
    p5.translate(p5.width / 2, p5.height / 2);
    let idx = 0;
    for (let k = 10; k < p5.width / 4; k += 10) {
      if (idx >= currencyGraphics.length) {
        idx = 0;
      }
      let moneyGraphic = currencyGraphics[idx];
      idx++;

      for (let i = 0; i < 360; i += 72 / (k / 10)) {
        let r = spacing * k;
        let direction = (k / 10) % 2 === 0 ? -p5.frameCount : p5.frameCount;
        let speed = 10 / k;
        let x = r * p5.cos(i + direction * speed);
        let y = r * -p5.sin(i + direction * speed);
        let s = k / 18 + circleSize;
        p5.image(moneyGraphic, x, y, s, s);
      }
    }
  };
};

export const ANY_COLOR_YOU_LIKE = (p5: p5) => {
  let palette = [
    [128, 0, 128], // V
    [2, 197, 242], // B
    [103, 206, 0], // G
    [255, 255, 0], // Y
    [255, 128, 0], // O
    [255, 0, 0], // R
  ].reverse();

  p5.setup = () => {
    p5.createCanvas(p5.windowHeight, p5.windowHeight);
  };

  p5.draw = () => {
    p5.background(0);
    p5.translate(p5.height / 2, p5.height / 2);
    let idx = 0;

    p5.push();
    p5.blendMode(p5.ADD);
    p5.angleMode(p5.DEGREES);
    p5.rectMode(p5.CENTER);
    for (let i = 18; i < 360 * 4; i += 18) {
      if (idx >= palette.length) {
        idx = 0;
      }
      let c = palette[idx];
      p5.fill(c[0], c[1], c[2], 1 / i);
      p5.push();
      p5.rotate(i / 5.4);
      p5.rotate((p5.frameCount * i) / 720);
      p5.stroke(c[0], c[1], c[2], (1080 * 36) / i);
      p5.strokeWeight(1.8);
      p5.rect(0, 0, i, i);
      p5.pop();
      idx++;
    }
    p5.pop();
  };
};

export const ECLIPSE = (p5: p5) => {
  class Moon {
    x: number;
    y: number;
    s: number;
    phase: number;
    constructor(x: number, y: number, s: number) {
      this.x = x;
      this.y = y;
      this.s = s;
      this.phase = 0;
    }

    show() {
      this.phase = ((p5.frameCount / 100 + p5.PI / 2) % p5.PI) - p5.PI / 2;
      p5.circle(this.x, this.y, this.s);
      p5.push();
      p5.fill(0);
      p5.circle(this.x + p5.sin(this.phase) * this.s, this.y, this.s);
      p5.pop();
    }
  }

  let moons: Moon[] = [];
  let circleSize = 0;

  p5.setup = () => {
    p5.createCanvas(p5.windowHeight, p5.windowHeight);
    circleSize = p5.windowHeight / 4;
    let rows = p5.floor(p5.windowHeight / circleSize);
    let cols = p5.floor(p5.windowHeight / circleSize);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let x = circleSize * i;
        let y = circleSize * j;
        let moon = new Moon(
          x + circleSize / 2,
          y + circleSize / 2,
          circleSize / 2,
        );
        moons.push(moon);
      }
    }
  };

  p5.draw = () => {
    p5.background(0);
    for (const moon of moons) {
      moon.show();
    }
  };
};

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div id="dsotm">
    <div id="speak_to_me"></div>
    <div id="breath_in_the_air"></div>
    <div id="on_the_run"></div>
    <div id="time"></div>
    <div id="greatest_gig"></div>
    <div id="money"></div>
    <div id="any_color_you_like"></div>
    <div id="eclipse"></div>
  </div>
`;

new p5(SPEAK_TO_ME, document.getElementById("speak_to_me")!);
new p5(BREATH_IN_THE_AIR, document.getElementById("breath_in_the_air")!);
new p5(ON_THE_RUN, document.getElementById("on_the_run")!);
new p5(TIME, document.getElementById("time")!);
new p5(GREATEST_GIG, document.getElementById("greatest_gig")!);
new p5(MONEY, document.getElementById("money")!);
new p5(ANY_COLOR_YOU_LIKE, document.getElementById("any_color_you_like")!);
new p5(ECLIPSE, document.getElementById("eclipse")!);
