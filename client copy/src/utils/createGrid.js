import { getRandomLetter } from "./getRandomLetter";
export function createGrid() {
  function isMobile() {
    return window.innerWidth <= 599;
  }
  const numRowsDesktop = 10;
  const numColsDesktop = 10;
  const numRowsMobile = 5;
  const numColsMobile = 5;

  const numRows = isMobile() ? numRowsMobile : numRowsDesktop;
  const numCols = isMobile() ? numColsMobile : numColsDesktop;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const gridItem = document.createElement("div");
      gridItem.className = "grid-item";
      gridItem.textContent = getRandomLetter();
      let coordinates = `${row},${col}`;
      gridItem.id = coordinates;
      if (gridItem) {
        gridItem.addEventListener("click", () => handleSelection());
      }
      if (gridContainer) {
        gridContainer.appendChild(gridItem);
      }
    }
  }
}
