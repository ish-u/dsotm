import "./style.css";

export const TIME = (p5: p5) => {
  let angle = 0;
  let circleSize = 144;
  let offsets: number[][] = [];
  let factor = 4;

  p5.setup = () => {
    p5.createCanvas(p5.windowHeight, p5.windowHeight);
    p5.angleMode(p5.DEGREES);

    for (let i = 0; i < factor * p5.width; i += circleSize) {
      let row: number[] = [];
      for (let j = 0; j < factor * p5.height; j += circleSize) {
        row.push(p5.random(0, 360));
      }
      offsets.push(row);
    }
  };

  p5.draw = () => {
    p5.background(0);

    p5.translate(-p5.frameCount / 4, -p5.frameCount / 4);

    for (let x = 0; x < factor * p5.width; x += circleSize) {
      for (let y = 0; y < factor * p5.height; y += circleSize) {
        let offset = 100 + offsets[x / circleSize][y / circleSize];

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
    angle += 0.25;
  };
};

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div class="sketch-grid">
    <div id="time"></div>
  </div>
`;

new p5(TIME, document.getElementById("time")!);
