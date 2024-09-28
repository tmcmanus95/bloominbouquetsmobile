import { tallyFlowerCount } from "../utils/tallyFlowerCount";
import { useState, useEffect } from "react";
import FlowerSprite from "./FlowerSprite";

export default function FlowerTallyBreakdown(words) {
  const [flowerTally, setFlowerTally] = useState({});

  const flowerMapping = [
    { name: "Grass", wordLength: 3, countKey: "three" },
    { name: "Dandelion", wordLength: 4, countKey: "four" },
    { name: "Daisy", wordLength: 5, countKey: "five" },
    { name: "Lily", wordLength: 6, countKey: "six" },
    { name: "Tulip", wordLength: 7, countKey: "seven" },
    { name: "Sunflower", wordLength: 8, countKey: "eight" },
    { name: "Azalea", wordLength: 9, countKey: "nine" },
    { name: "Rose", wordLength: 10, countKey: "ten" },
    { name: "Orchid", wordLength: 11, countKey: "eleven" },
    { name: "Golden Rose", wordLength: 12, countKey: "twelve" },
  ];

  useEffect(() => {
    setFlowerTally(tallyFlowerCount(words));
  }, [words]);

  return (
    <div className="border-2 ">
      <div className="border-2 border-green grid md:grid-cols-10 grid-cols-5 md:text-m text-xs mx-2">
        {flowerMapping.map((flower) => (
          <div className="flex flex-col text-center">
            <h4 className="border-l-2 border-r-2 border-t-2 border-green-600">
              {flower.wordLength} Letters
            </h4>
            <div
              key={flower.name}
              className="border-2 border-green-600 flex flex-col md:mb-0 mb-2"
            >
              <h3>{flower.name}</h3>
              <div className="flex justify-center items-center flex-col ">
                <FlowerSprite wordLength={flower.wordLength} />
                <h5>
                  {flowerTally[flower.countKey]}{" "}
                  {flowerTally[flower.countKey] != 1 ? (
                    <span>words</span>
                  ) : (
                    <span>word</span>
                  )}
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
