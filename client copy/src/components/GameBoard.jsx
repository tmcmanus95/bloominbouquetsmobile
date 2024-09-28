import { useState, useEffect } from "react";
import { getRandomLetter } from "../utils/getRandomLetter";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_WORD } from "../utils/mutations";
import { QUERY_ME, GET_DAILY_BOARD } from "../utils/queries";
import { UPDATE_DAILY_BOARD, SHUFFLE_BOARD } from "../utils/mutations";
import CurrentWord from "./CurrentWord";
import GameBoardBestWordList from "./GameBoardBestWordList";
import GameBoardMostRecentWordList from "./GameBoardMostRecentWordList";
import GameBoardMostRecentWordListMobile from "./GameBoadMostRecentListMobile";
import FlowerSprite from "./FlowerSprite";
import Auth from "../utils/auth";
import { Link } from "react-router-dom";
import { shuffleCountToSeedReduction } from "../utils/shuffleCountToSeedReduction";
import wordLengthToSeedPrice from "../utils/wordLengthToSeedPrice";
import Loading from "../components/Loading";
import { CHECK_WORD_VALIDITY } from "../utils/mutations";
import { getTileBackground } from "../utils/getTileBackground";
export default function GameBoard() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [tooFarIds, setTooFarIds] = useState([]);
  const [dailyGameBoardString, setDailyGameBoardString] = useState("");
  const [areYouSureVisible, setAreYouSureVisible] = useState(false);
  const [dailyTail, setDailyTail] = useState("");
  const [localStorageBoard, setLocalStorageBoard] = useState(
    localStorage.getItem("dailyBoard")
  );
  const [newGameBoard, setNewGameBoard] = useState([]);
  const [realWord, setRealWord] = useState(false);
  const [fakeWord, setFakeWord] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [validWord, setValidWord] = useState("");
  const [invalidWord, setInvalidWord] = useState("");
  const [shufflePrice, setShufflePrice] = useState(50);
  const [insufficientSeeds, setInsufficentSeeds] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Auth.loggedIn());
  const [goldenSeedAmount, setGoldenSeedAmount] = useState(0);
  const [dailyShuffleCount, setDailyShuffleCount] = useState(0);
  const [updateBoard] = useMutation(UPDATE_DAILY_BOARD);
  const [swipeMode, setSwipeMode] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [loadingBoard, setLoadingBoard] = useState([]);
  const [wordLength, setWordLength] = useState(0);
  const { data: dailyBoardData, error: dailyBoardError } =
    useQuery(GET_DAILY_BOARD);
  const [addWord, error] = useMutation(ADD_WORD);
  const [shuffleBoard, { error: shuffleBoardError }] =
    useMutation(SHUFFLE_BOARD);
  const [checkWordValidityTest, { error: checkWordValidityTestError }] =
    useMutation(CHECK_WORD_VALIDITY);
  function isMobile() {
    return window.innerWidth <= 599;
  }

  const numRows = isMobile() ? 7 : 10;
  const numCols = isMobile() ? 7 : 10;

  const addLetter = (tile) => {
    setAlertVisible(false);
    const { id } = tile;
    if (selectedIds.includes(id)) {
      const lastSelectedId = selectedIds[selectedIds.length - 1];
      if (id === lastSelectedId) {
        const remainingIds = selectedIds.slice(0, -1);
        setSelectedIds(remainingIds);
      }
    } else {
      if (selectedIds.length === 0 || hasAdjacentSelected(tile)) {
        setAlertVisible(false);

        setSelectedIds([...selectedIds, id]);
      } else {
        setTooFarIds([...tooFarIds, id]);
        setAlertText(
          "You must select a tile adjacent to a tile you have already selected."
        );
        setAlertVisible(true);
        setTimeout(() => {
          setTooFarIds([]);
        }, 500);
        setTimeout(() => {
          setAlertText("");
          setAlertVisible(false);
        }, 5000);
      }
    }
  };
  const hasAdjacentSelected = (tile) => {
    const { id } = tile;
    return selectedIds.some((selectedId) => isAdjacentTile(selectedId, id));
  };
  const toggleAreYouSure = () => {
    setAreYouSureVisible(!areYouSureVisible);
  };

  const isAdjacentTile = (id1, id2) => {
    const tile1 = getTileById(id1);
    const tile2 = getTileById(id2);

    const rowDiff = Math.abs(tile1.row - tile2.row);
    const colDiff = Math.abs(tile1.col - tile2.col);

    return (
      (rowDiff === 0 && colDiff === 1) ||
      (colDiff === 0 && rowDiff === 1) ||
      (rowDiff === 1 && colDiff === 1)
    );
  };

  const getTileById = (id) => {
    return newGameBoard.find((tile) => tile.id === id);
  };
  const handleTouchStart = (event, tile) => {
    addLetter(tile);
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains("grid-item")) {
      const tileId = parseInt(element.getAttribute("data-id"), 10);
      const tile = getTileById(tileId);
      if (tile && !selectedIds.includes(tile.id)) {
        addLetter(tile);
      }
    }
  };

  if (isMobile()) {
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "scroll";
      };
    }, [loadingBoard]);
  }

  if (isLoggedIn) {
    useEffect(() => {
      const initializeGameBoard = (dailyGameBoardData) => {
        const board = [];
        let id = 0;

        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const tile = {
              id: id,
              letter: dailyGameBoardData[id],
              row: row,
              col: col,
              isFlipped: false,
            };
            board.push(tile);
            id++;
          }
        }

        setNewGameBoard(board);
      };

      if (dailyBoardData?.dailyRandomization?.dailyBoard) {
        const dailyGameBoardData = dailyBoardData.dailyRandomization.dailyBoard;
        setDailyGameBoardString(dailyGameBoardData);
        setDailyTail(dailyBoardData?.dailyRandomization?.dailyBoard.slice(49));
        setGoldenSeedAmount(dailyBoardData?.dailyRandomization?.goldenSeeds);
        setDailyShuffleCount(
          dailyBoardData?.dailyRandomization?.dailyShuffleCount
        );
        setShufflePrice(
          shuffleCountToSeedReduction(
            dailyBoardData?.dailyRandomization?.dailyShuffleCount
          )
        );
        initializeGameBoard(dailyGameBoardData);
      }
    }, [numRows, numCols, dailyBoardData, isLoggedIn]);
  } else if (localStorageBoard?.length > 0) {
    useEffect(() => {
      const dailyGameBoardData = localStorage.getItem("dailyBoard");
      setDailyGameBoardString(dailyGameBoardData);
      setDailyTail(dailyGameBoardData.slice(48));

      const initializeGameBoard = () => {
        const board = [];
        let id = 0;
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const tile = {
              id: id,
              letter: dailyGameBoardData[id],
              row: row,
              col: col,
              isFlipped: false,
            };
            board.push(tile);
            id++;
          }
        }
        setNewGameBoard(board);
      };

      initializeGameBoard();
    }, [numRows, numCols]);
  } else {
    useEffect(() => {
      const initializeGameBoard = () => {
        const board = [];
        let id = 0;
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const tile = {
              id: id,
              letter: getRandomLetter(),
              row: row,
              col: col,
              isFlipped: false,
            };
            board.push(tile);
            id++;
          }
        }
        setNewGameBoard(board);
      };

      initializeGameBoard();
    }, [numRows, numCols]);
  }
  useEffect(() => {
    const tempBoard = [];
    for (let i = 0; i < numCols * numRows; i++) {
      tempBoard.push(i);
    }
    setLoadingBoard(tempBoard);
  }, [numCols, numRows]);
  const wordLengthStyle = (wordLength) => {
    let backgroundColor = getTileBackground(wordLength);

    return {
      background: backgroundColor,
    };
  };
  const selectedTile = (tile) => {
    const isSelected = selectedIds.includes(tile.id);
    const isTooFar = tooFarIds.includes(tile.id);
    const isAdjacent = hasAdjacentSelected(tile);
    const isMostRecent =
      selectedIds.length > 0 && tile.id === selectedIds[selectedIds.length - 1];
    let backgroundColor;
    let textColor = "black";
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      backgroundColor = "#010b1c";
      textColor = "white";
    } else {
      backgroundColor = "ghostwhite";
    }

    if (isSelected && realWord) {
      backgroundColor = getTileBackground(wordLength);
      textColor = "#2d5421";
    } else if (isSelected && !realWord) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        textColor = "black";
      }
      backgroundColor = "#a8cc9e";
    } else if (isAdjacent) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        textColor = "black";
      }
      backgroundColor = "#e2d1c4";
    }
    if (isTooFar) {
      backgroundColor = "indianRed";
    }

    if (isMostRecent && realWord) {
      backgroundColor = getTileBackground(wordLength);
      textColor = "#2d5421";
    } else if (isMostRecent) {
      backgroundColor = "#4d9039";
      textColor = "white";
    }

    if (isSelected && fakeWord) {
      backgroundColor = "indianRed";
    }

    return {
      background: backgroundColor,
      color: textColor,
      transform: tile.isFlipped ? "rotateX(180deg)" : "none",
    };
  };
  async function checkWordValidityTesting(word) {
    const userWord = word.join("");

    try {
      const { data } = await checkWordValidityTest({
        variables: {
          word: userWord,
          userId: isLoggedIn ? dailyBoardData.dailyRandomization._id : null,
        },
      });

      if (data.checkWordValidity.success) {
        if (data.checkWordValidity.message == "Word already added") {
          setAlertText(`${userWord} already owned`);
          setAlertVisible(true);
          setTimeout(() => {
            setAlertText("");
            setAlertVisible(false);
          }, 1000);
        }
        await addNewWord(userWord);
      } else {
        setFakeWord(true);
        setInvalidWord(userWord);
        setTimeout(async () => {
          setSelectedIds([]);
          setFakeWord(false);
          setInvalidWord("");
        }, 1000);
      }
    } catch (error) {
      console.error("Error checking word validity:", error.message);
    }
  }
  async function addNewWord(word) {
    if (word.length > 2) {
      setValidWord(word);
      const updatedBoard = newGameBoard.map((tile) =>
        selectedIds.includes(tile.id) ? { ...tile, isFlipped: true } : tile
      );

      setRealWord(true);
      setWordLength(word.length);
      setNewGameBoard(updatedBoard);
      let tempString = "";

      setTimeout(async () => {
        const resetBoard = newGameBoard.map((tile) =>
          selectedIds.includes(tile.id)
            ? { ...tile, isFlipped: false, letter: getRandomLetter() }
            : tile
        );

        setNewGameBoard(resetBoard);
        if (isLoggedIn) {
          try {
            await handleAddWord(word, resetBoard);

            // console.log("logged in daily board", dailyBoard);

            for (let i = 0; i < resetBoard.length; i++) {
              tempString += resetBoard[i].letter;
            }
            const dailyBoard = isMobile() ? tempString + dailyTail : tempString;

            // let boardTest = tempString.length + dailyTail.length;

            setDailyGameBoardString(tempString);

            const { data: updatedBoardData } = await updateBoard({
              variables: {
                userId: dailyBoardData.dailyRandomization._id,
                dailyBoard: dailyBoard,
              },
            });
          } catch (error) {
            console.error("Error updating board:", error);
          }
        } else {
          const dailyBoard = isMobile() ? tempString + dailyTail : tempString;

          localStorage.setItem("dailyBoard", dailyBoard);
          setAlertText(
            "Login to save words and flowers and earn golden seeds!"
          );
          setAlertVisible(true);
          setTimeout(() => {
            setAlertText("");
            setAlertVisible(false);
          }, 2000);
        }

        setSelectedIds([]);
        setRealWord(false);
        setValidWord("");
      }, 1000);
    } else {
      setFakeWord(true);
      setInvalidWord(word);
      setTimeout(async () => {
        setSelectedIds([]);
        setFakeWord(false);
        setInvalidWord("");
      }, 1000);
    }
  }
  const toggleSwipeMode = () => {
    setSwipeMode(!swipeMode);
    if (swipeMode) {
      setAlertText("Click Mode Enabled");
    } else {
      setAlertText("Swipe Mode Enabled");
    }
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
      setAlertText("");
    }, 1000);
  };

  const handleShuffleBoard = async () => {
    try {
      const { data } = await shuffleBoard({
        variables: {
          userId: dailyBoardData.dailyRandomization._id,
        },
      });
      setGoldenSeedAmount(data.shuffleBoard.goldenSeeds);
      setDailyShuffleCount(data.shuffleBoard.dailyShuffleCount);
      setShufflePrice(
        shuffleCountToSeedReduction(data.shuffleBoard.dailyShuffleCount)
      );
      newGameBoard.forEach((tile) => {
        setTimeout(() => {
          setNewGameBoard((prevBoard) =>
            prevBoard.map((t) =>
              t.id === tile.id ? { ...t, isFlipped: true } : t
            )
          );
        }, tile.id * 5);
      });

      setTimeout(() => {
        newGameBoard.forEach((tile) => {
          setTimeout(() => {
            setNewGameBoard((prevBoard) =>
              prevBoard.map((t) =>
                t.id === tile.id ? { ...t, isFlipped: false } : t
              )
            );
          }, tile.id * 5);
        });
      }, 500);

      toggleAreYouSure();
    } catch (error) {
      console.log("Error adding word");
    }
  };

  const handleAddWord = async (newWord, currentBoard) => {
    try {
      const { data } = await addWord({
        variables: {
          word: newWord,
          userId: dailyBoardData.dailyRandomization._id,
        },
      });

      if (data) {
        setGoldenSeedAmount(data.addWord.goldenSeeds);

        setNewGameBoard(currentBoard);
      }
    } catch (error) {
      console.error("Error adding word:", error.message);
    }
  };
  const hasEnoughSeeds = () => {
    if (goldenSeedAmount >= shufflePrice) {
      toggleAreYouSure();
    } else {
      toggleInsufficientSeeds();
    }
  };

  const toggleInsufficientSeeds = () => {
    setInsufficentSeeds(true);
  };

  return (
    <div className=" dark:text-white mt-8 text-black pb-20">
      {/* <CurrentWord
        selectedLetters={selectedIds.map((id) => getTileById(id).letter)}
      /> */}
      <div className="flex justify-center">
        {alertVisible ? (
          <h1 className="z-20 bg-yellow-300 text-black rounded-lg p-5 absolute mt-2">
            {alertText}
          </h1>
        ) : (
          <></>
        )}
      </div>

      <div className="current-word-container flex justify-center align-center md:text-5xl text-2xl">
        {selectedIds.map((id) => getTileById(id).letter).join("").length >
          2 && (
          <span className="bg-yellow-500 p-2 rounded-lg md:text-2xl text-xl text-black absolute top-15 md:right-80 right-6 z-20">
            {wordLengthToSeedPrice(
              selectedIds.map((id) => getTileById(id).letter).join("").length
            )}
          </span>
        )}
        {invalidWord && (
          <h1 className="incorrect flex align-center">{invalidWord}</h1>
        )}
        {realWord && (
          <h1
            className="flex align-center correct"
            style={wordLengthStyle(validWord.length)}
          >
            {validWord}
            <span className="rounded-lg ml-2 dark:bg-black bg-white">
              <FlowerSprite wordLength={validWord.length} />
            </span>
          </h1>
        )}
        {!realWord && !invalidWord ? (
          <h1 className="flex align-center">
            {selectedIds.map((id) => getTileById(id).letter)}
            <FlowerSprite
              wordLength={
                selectedIds.map((id) => getTileById(id).letter).join("").length
              }
            />
          </h1>
        ) : (
          <></>
        )}
      </div>
      <div className="flex justify-center">
        <div id="main-container">
          <div
            id="grid-container"
            onTouchMove={swipeMode ? (e) => handleTouchMove(e) : null}
          >
            {newGameBoard.length > 0
              ? newGameBoard.map((tile) => (
                  <div
                    onTouchStart={
                      swipeMode ? (e) => handleTouchStart(e, tile) : null
                    }
                    key={tile.id}
                    data-id={tile.id}
                    style={selectedTile(tile)}
                    className={`grid-item text-black dark:text-white ${
                      isFlipped ? "flip-animation" : ""
                    }`}
                    onClick={() => addLetter(tile)}
                  >
                    {tile.letter}
                  </div>
                ))
              : loadingBoard.map((loader, index) => (
                  <div className="flex justify-center">
                    <Loading size={30} />
                  </div>
                ))}
          </div>
        </div>
      </div>
      <div className=" flex justify-center items-center md:flex-col">
        <div className=" flex flex-col md:mr-0 mr-3 ">
          <div className="flex-col justify-center text-center ">
            <div className="flex justify-center">
              <button
                className="flex dark:bg-green-900 bg-green-300 hover:bg-green-500 dark:text-white text-black"
                onClick={async () => {
                  await checkWordValidityTesting(
                    selectedIds.map((id) => getTileById(id).letter)
                  );
                }}
              >
                Submit
              </button>
              {isLoggedIn && (
                <>
                  {!areYouSureVisible ? (
                    <button
                      className="flex dark:bg-green-900 bg-green-300 hover:bg-green-500 dark:text-white text-black"
                      onClick={async () => await hasEnoughSeeds()}
                    >
                      Shuffle
                    </button>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>

            {insufficientSeeds && (
              <div>
                <h1 className="">You need {shufflePrice} seeds to shuffle</h1>
                <div className="">
                  <Link
                    to={`/buyGoldenSeeds`}
                    onClick={async () => await toggleInsufficientSeeds()}
                  >
                    <button className=" dark:bg-green-900 bg-green-300 hover:bg-green-500 dark:text-white text-black">
                      Buy more
                    </button>
                  </Link>
                  <button
                    className=" dark:bg-red-900 bg-red-300 hover:bg-red-500 dark:text-white text-black"
                    onClick={async () => await toggleInsufficientSeeds()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {areYouSureVisible && (
              <div>
                <h1 className="">Shuffling will cost {shufflePrice} seeds</h1>
                <div className="">
                  <button
                    className=" dark:bg-green-900 bg-green-300 hover:bg-green-500 dark:text-white text-black"
                    onClick={async () => await handleShuffleBoard()}
                  >
                    Shuffle anyway
                  </button>
                  <button
                    className=" dark:bg-red-900 bg-red-300 hover:bg-red-500 dark:text-white text-black"
                    onClick={async () => await toggleAreYouSure()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          {isMobile() ? (
            <div className="flex justify-center">
              <button
                onClick={() => toggleSwipeMode()}
                className=" dark:bg-green-900 bg-green-300 hover:bg-green-500 dark:text-white text-black"
              >
                Toggle mode
              </button>
            </div>
          ) : (
            <></>
          )}
          <div className="flex justify-center items-center">
            <h1 className="m-2">Golden Seeds</h1>
            <h1 className=" bg-yellow-500 p-2 rounded-lg md:text-2xl text-xl mt-2 text-black">
              {goldenSeedAmount}
            </h1>
          </div>
        </div>
        {isMobile() ? (
          isLoggedIn ? (
            <>
              {dailyBoardData ? (
                <GameBoardMostRecentWordListMobile
                  words={dailyBoardData?.dailyRandomization?.words}
                  userId={dailyBoardData.dailyRandomization?._id}
                />
              ) : (
                <></>
              )}
            </>
          ) : (
            <div className="flex flex-row justify-center mt-5">
              Login to save words
            </div>
          )
        ) : isLoggedIn ? (
          <div className="flex flex-row justify-center mt-5">
            <div>
              {dailyBoardData ? (
                <GameBoardBestWordList
                  words={dailyBoardData?.dailyRandomization?.words}
                  userId={dailyBoardData?.dailyRandomization?._id}
                />
              ) : (
                <></>
              )}
            </div>
            <div>
              {dailyBoardData ? (
                <GameBoardMostRecentWordList
                  words={dailyBoardData?.dailyRandomization?.words}
                  userId={dailyBoardData?.dailyRandomization?._id}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-row justify-center mt-5">
            Login to save words
          </div>
        )}
      </div>
    </div>
  );
}
