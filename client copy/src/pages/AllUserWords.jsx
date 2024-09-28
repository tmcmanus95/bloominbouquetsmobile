import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { QUERY_ALL_USER_WORDS } from "../utils/queries";
import { IoFlowerOutline } from "react-icons/io5";
import FlowerSprite from "../components/FlowerSprite";
import FlowerTallyBreakdown from "../components/FlowerTallyBreakdown";

export default function AllUserWords() {
  const { userId } = useParams();
  const [words, setWords] = useState([]);
  const [chronologicalOrder, setChronologicalOrder] = useState([]);
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("");

  const handleAlphabetize = () => {
    const sortedWords = [...words].sort();

    setWords(sortedWords);
  };
  const handleNewest = () => {
    const sortedWords = [...chronologicalOrder];
    setWords(sortedWords);
  };
  const handleOldest = () => {
    const sortedWords = [...chronologicalOrder].reverse();
    setWords(sortedWords);
  };

  const handleShortestFirst = () => {
    const sortedWords = [...words].sort((a, b) => a.length - b.length);
    setWords(sortedWords);
  };

  const handleLongestFirst = () => {
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    setWords(sortedWords);
  };

  const { data, loading, error } = useQuery(QUERY_ALL_USER_WORDS, {
    variables: { userId: userId },
  });
  useEffect(() => {
    if (data?.user?.words) {
      setChronologicalOrder(data?.user?.words);
      setWords(data?.user?.words);
      setUsername(data?.user?.username);
      setColor(data?.user?.color);
    }
  }, [data]);
  return (
    <div className="mt-20 dark:text-white">
      <div className="flex flex-row justify-center md:text-5xl text-4xl">
        <IoFlowerOutline style={{ color: color }} className="mr-2" />

        <h1 className="mb-5"> {username}'s Words</h1>
      </div>
      <FlowerTallyBreakdown words={words} />
      <div className="border-2 border-green-500 mx-2">
        <h1 className="md:text-3xl text-2xl text-center">All Words</h1>

        <div className="text-center ">
          <button
            onClick={handleNewest}
            className="border-green-500 border-2 md:text-base text-xs"
          >
            Newest
          </button>
          <button
            onClick={handleOldest}
            className="border-green-500 border-2 md:text-base text-xs"
          >
            Oldest
          </button>

          <button
            onClick={handleShortestFirst}
            className="border-green-500 border-2 md:text-base text-xs"
          >
            Shortest First
          </button>
          <button
            onClick={handleLongestFirst}
            className="border-green-500 border-2 md:text-base text-xs"
          >
            Longest First
          </button>

          <button
            onClick={handleAlphabetize}
            className="border-green-500 border-2 md:text-base text-xs"
          >
            Alphabetically
          </button>
        </div>
        <div className="grid md:grid-cols-12 grid-cols-5 ">
          {words && (
            <>
              {words.map((word, index) => (
                <Link key={index} to={`/singleWord/${word}`}>
                  <div className="md:text-sm text-xs overflow-hidden border-2 hover:border-green-300 border-transparent rounded-lg m-2 flex flex-col items-center">
                    {word}
                    <div className="align-center justify-center">
                      <FlowerSprite wordLength={word.length} />
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
