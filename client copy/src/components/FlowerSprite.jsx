import { setFlowerForWordLength } from "../utils/setFlowerForWordLength";
export default function FlowerSprite({ wordLength }) {
  const selectedFlower = setFlowerForWordLength(wordLength);

  if (!selectedFlower) {
    return null;
  }

  return (
    <img
      src={selectedFlower}
      style={{ height: "40px", width: "40px" }}
      alt="flower"
    />
  );
}
