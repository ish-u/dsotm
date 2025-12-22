import "./style.css";
import { setupCounter } from "./counter.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    dsotm
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
