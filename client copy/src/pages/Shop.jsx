import { useState, useEffect } from "react";
import FeaturedWords from "../components/FeaturedWords";
import WordSearch from "../components/WordSearch";
import { useQuery } from "@apollo/client";
import { QUERY_SHOP_ME } from "../utils/queries";

export default function Shop() {
  const { data, loading, error } = useQuery(QUERY_SHOP_ME);
  const [initialSeedsToSpend, setInitialSeedsToSpend] = useState(0);
  const [initialWords, setInitialWords] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (data) {
      setInitialSeedsToSpend(data?.me?.goldenSeeds || 0);
      setInitialWords(data?.me?.words || []);
      setUserId(data?.me?._id);
    }
  }, [data]);

  const handleUpdateSeeds = (newSeeds) => {
    setInitialSeedsToSpend(newSeeds);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-20 dark:text-white m-5 ">
      <div className="text-center md:text-5xl text-3xl flex flex-col bg-green-400 dark:bg-green-950 p-5 rounded-lg">
        <h1>Flower Shop | Word Shop</h1>
        <h2 className="md:text-base text-sm p-2">
          Spend your hard earned golden seeds on new words and flowers!
        </h2>
      </div>

      <div className="border-b-2 inline-block pb-2 mt-5">
        Seeds to Spend:
        <span className="bg-yellow-500 text-black z-20 ml-2 text-lg p-1 rounded-md">
          {initialSeedsToSpend}
        </span>
      </div>

      <FeaturedWords />

      <WordSearch
        initialWords={initialWords}
        initialSeedsToSpend={initialSeedsToSpend}
        updateSeeds={handleUpdateSeeds}
      />
    </div>
  );
}
