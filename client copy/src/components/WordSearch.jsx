import { useState } from "react";
import { useMutation } from "@apollo/client";
import { BUY_WORD } from "../utils/mutations";
import wordLengthToSeedPrice from "../utils/wordLengthToSeedPrice";
import FlowerSprite from "./FlowerSprite";
import Auth from "../utils/auth";
import { CHECK_WORD_VALIDITY } from "../utils/mutations";
import { Link } from "react-router-dom";

export default function WordSearch({
  initialWords,
  initialSeedsToSpend,
  updateSeeds,
  userId,
}) {
  const [inputValue, setInputValue] = useState("");
  const [wordDisplayed, setWordDisplayed] = useState("");
  const [seedsToSpend, setSeedsToSpend] = useState(initialSeedsToSpend);
  const [words, setWords] = useState(initialWords);
  const [wordPrice, setWordPrice] = useState(0);
  const [alertText, setAlertText] = useState("");
  const [buyable, setBuyable] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Auth.loggedIn());
  const [checkWordValidityTest, { error: checkWordValidityTestError }] =
    useMutation(CHECK_WORD_VALIDITY);

  const [buyWord, error] = useMutation(BUY_WORD);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  async function handleSearchWord(e) {
    e.preventDefault();
    try {
      const { data } = await checkWordValidityTest({
        variables: {
          word: inputValue,
          userId: isLoggedIn ? userId : null,
        },
      });

      if (data.checkWordValidity.success) {
        if (!words.includes(inputValue.toUpperCase())) {
          setWordDisplayed(inputValue);
          setWordPrice(wordLengthToSeedPrice(inputValue.length));
          console.log(
            `seeds to spend ${seedsToSpend} | word price ${wordPrice}`
          );
          if (seedsToSpend >= wordPrice) {
            setBuyable(true);
          }
        } else {
          setWordDisplayed(`${inputValue} already owned 🌸`);
        }
      } else {
        setWordDisplayed(`Could not find ${inputValue}`);
      }
      setInputValue("");
    } catch (error) {
      console.error("Error checking word validity:", error.message);
    }
  }

  const handleBuyWord = async () => {
    try {
      const { data } = await buyWord({
        variables: { word: wordDisplayed.toUpperCase() },
      });
      const newSeeds = data?.buyWord?.goldenSeeds;
      setWords((prevWords) => [...prevWords, wordDisplayed.toUpperCase()]);
      setSeedsToSpend(newSeeds);
      updateSeeds(newSeeds);
      setWordDisplayed("");
      setInputValue("");
      setWordPrice(0);
      setAlertText(`Successfully Purchased ${wordDisplayed}!`);
      setBuyable(false);
      setTimeout(() => {
        setAlertText("");
      }, 1000);
    } catch (error) {
      console.log("could not buy word");
    }
  };

  return (
    <div className="text-center">
      <div className="border-b-2 border-white inline-block m-5">
        Search for a word to purchase
      </div>
      <form onSubmit={handleSearchWord}>
        <input
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
          className="text-black border-2 border-green-700 text-3xl"
        ></input>
      </form>
      <div className="text-xl">{alertText}</div>
      <div className="flex flex-row text-center justify-center mt-10">
        <div
          className={`md:text-4xl ${
            buyable ? "border-r-2 border-black" : ""
          } dark:border-white p-5 flex flex-row`}
        >
          {wordDisplayed}
          {buyable && (
            <div className="flex flex-row">
              <FlowerSprite wordLength={wordDisplayed.length} />
            </div>
          )}
        </div>
        {buyable && (
          <div className="flex flex-col">
            <div className="ml-2">
              <span>Price: </span>
              <span className="bg-yellow-500 p-2 rounded-lg md:text-2xl text-lg ml-2">
                {wordPrice}
              </span>
              {wordPrice > 1 ? (
                <span className="ml-2">Golden seeds</span>
              ) : (
                <span className="ml-2">Golden seed</span>
              )}
            </div>
            {isLoggedIn ? (
              <button
                className="bg-green-500 hover:bg-green-700 text-white ml-2 mt-4"
                onClick={handleBuyWord}
              >
                Buy
              </button>
            ) : (
              <Link to={`/login`}>
                <button className="bg-green-500 hover:bg-green-700 text-white ml-2 mt-4">
                  Log In to Buy
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
