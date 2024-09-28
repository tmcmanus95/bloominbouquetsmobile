import FlowerSprite from "./FlowerSprite";
import { Link } from "react-router-dom";
export default function GameBoardBestWordList({ words, userId }) {
  let sortedWords = words?.slice().sort((a, b) => b.length - a.length);
  sortedWords = sortedWords?.slice(0, 10);
  return (
    <section className=" flex justify-center flex-col md:text-3xl text-2xl  p-3 border-solid border-green-500 dark:border-white border-2 overflow-hidden text-ellipsis">
      <Link to={`/user/${userId}/allWords`}>
        <h1 className="md:text-3xl text-xl text-decoration-line: underline mb-2 p-2 text-center">
          Best Words
        </h1>
      </Link>
      <div className="flex justify-center flex-col ">
        {sortedWords ? (
          sortedWords.map((word, index) => (
            <div
              key={index}
              className="flex flex-row justify-end md:text-2xl text-base overflow-hidden text-ellipsis"
            >
              <p>
                <span>{word.length} </span>
                {word}
              </p>
              <FlowerSprite wordLength={word.length} />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </section>
  );
}
