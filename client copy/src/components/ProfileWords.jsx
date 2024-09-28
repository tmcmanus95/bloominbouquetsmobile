import { Link } from "react-router-dom";
import FlowerSprite from "./FlowerSprite";
import { useState, useEffect } from "react";
export default function ProfileWords({ words, userId }) {
  const [sliceValue, setSliceValue] = useState(15);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSliceValue(14);
      } else {
        setSliceValue(50);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let sortedWords = words
    .slice()
    .sort((a, b) => b.length - a.length)
    .slice(0, sliceValue);
  return (
    <section className="relative m-2 flex justify-center flex-col border-black dark:border-white border-2">
      <h1 className="md:text-3xl text-center">Best Words</h1>
      <div className="">
        <div className="grid grid-cols-2 md:grid-cols-8 content-start">
          {sortedWords ? (
            sortedWords.map((word, index) => (
              <div
                key={index}
                className="flex flex-row items-center md:text-base "
              >
                <p className="text-xs">
                  <span>{word.length} </span>
                  {word}
                </p>
                <FlowerSprite wordLength={word.length} />
              </div>
            ))
          ) : (
            <></>
          )}
          <Link
            to={`/user/${userId}/allWords`}
            className="border-green-500 border-2 hover:cursor:pointer text-center hover:border-green-700 m-0 absolute bottom-2 right-2 p-1 bg-white dark:bg-black"
          >
            All Words
          </Link>
        </div>
      </div>
    </section>
  );
}
