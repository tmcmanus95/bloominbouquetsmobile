import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleWord } from "../utils/getSingleWord";
import Loading from "../components/Loading";

export default function SingleWord() {
  const { word } = useParams();
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        const data = await getSingleWord(word);
        setWordData(data);
      } catch (error) {
        setError("Failed to fetch word data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWordData();
  }, [word]);

  if (loading) return <Loading></Loading>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-30">
      <h1>Word: {word}</h1>
      {wordData ? <div></div> : <div>No data found</div>}
    </div>
  );
}
