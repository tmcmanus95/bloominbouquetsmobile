import FlowerSprite from "./FlowerSprite";
import { Link } from "react-router-dom";
export default function GameBoardMostRecentWordList({ words, userId }) {
  let sortedWords = words?.slice(words.length - 10, words.length);
  sortedWords?.reverse();
  return (
    <section className="ml-5 flex justify-center flex-col md:text-3xl text-2xl p-3  border-green-500 dark:border-white  border-solid border-2">
      <Link to={`/user/${userId}/allWords`}>
        <h1 className="md:text-3xl text-xl text-decoration-line: underline mb-2 text-center p-2">
          Recent Words
        </h1>
      </Link>
      <div className="flex justify-center flex-col ">
        {sortedWords ? (
          sortedWords.map((word, index) => (
            <div
              key={index}
              className="flex flex-row justify-end md:text-2xl text-base"
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
