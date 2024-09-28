import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { SEND_WORD } from "../utils/mutations";
import { QUERY_MY_WORDS_AND_MY_FRIENDS } from "../utils/queries";
import FlowerSprite from "../components/FlowerSprite";
import Bouquet from "../components/Bouquet";
export default function SendWord() {
  const { data, loading } = useQuery(QUERY_MY_WORDS_AND_MY_FRIENDS);
  const [sendWord, error] = useMutation(SEND_WORD);
  const [friends, setFriends] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [recipientUsername, setRecipientUsername] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState(false);
  const [wordSent, setWordSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [words, setWords] = useState([]);
  const [wordsToSend, setWordsToSend] = useState([]);
  const initialRecipient = useParams();
  const handleSendWord = async (wordsToSend) => {
    let userId = data.me._id;
    const stringWordsToSend = wordsToSend.join(",");
    try {
      const { data } = await sendWord({
        variables: {
          giftedWords: stringWordsToSend,
          userId: userId,
          recipientId: recipientId,
        },
      });
      setWordSent(true);
    } catch (error) {
      console.log("Could not send word");
    }
  };

  const handleSetRecipientId = (recipient) => {
    setRecipientId(recipient._id);
    setRecipientUsername(recipient.username);
    setSelectedRecipient(true);
    setSearchUsername("");
  };
  const addWordToSend = (word) => {
    setWordsToSend((prevWords) => [...prevWords, word]);
    setWords(data.me.words);
    setSearchTerm("");
  };
  const handleWordInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleFriendInputChange = (e) => {
    setSearchUsername(e.target.value);
  };

  useEffect(() => {
    if (data) {
      if (data.me.friends.length > 0) {
        setFriends(data.me.friends);
        setRecipientId(initialRecipient.userId);
        for (let i = 0; i < data.me.friends.length; i++) {
          if (data.me.friends[i]._id == initialRecipient.userId) {
            setRecipientUsername(data.me.friends[i].username);
          }
        }
        setSelectedRecipient(true);
      }
      if (data.me.words.length > 0) {
        setWords(data.me.words);
      }
    }
  }, [data]);
  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchUsername.toLowerCase())
  );
  const filteredWords = words.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="flex justify-center">
      {wordSent ? (
        <h1>Thanks for sending!</h1>
      ) : (
        <div className="flex bg-green-100 p-5 justify-center align-center">
          <div className="dark:bg-slate-700 dark:text-white">
            <h1 className="border-2 border-black text-xl flex justify-center p-3 rounded-lg">
              Send a Bouquet
            </h1>
            <Bouquet
              words={wordsToSend}
              senderUsername={data?.me.username}
              senderId={data?.me._id}
            />
            <div className="flex flex-row mt-3">
              {wordsToSend.map((word, index) => (
                <div key={index} className="flex flex-row">
                  <h1>{word}</h1>
                  <FlowerSprite wordLength={word.length} />
                </div>
              ))}
            </div>
            {selectedRecipient ? (
              <div className="flex flex-row">
                <h1 className="mr-3">To:</h1>
                <h1 className="border-2 border-black rounded-lg p-2">
                  {recipientUsername}
                </h1>
              </div>
            ) : (
              <></>
            )}
            <div className="flex flex-col">
              <div className="flex md:flex-row flex-col">
                <div className="flex flex-col">
                  <div>
                    <h1 className="mx-2 md:mx-5">Select Words to Send</h1>
                    <input
                      className="text-black text-xl md:text-3xl mx-2 md:mx-5 border-2 border-gray-400 pt-2 px-4 rounded"
                      type="text"
                      placeholder="Search for a word..."
                      value={searchTerm}
                      onChange={handleWordInputChange}
                    />

                    {searchTerm && (
                      <div>
                        <ul className="mt-1 bg-white border border-gray-300 mx-2 md:mx-5">
                          {filteredWords &&
                            filteredWords.map((word) => (
                              <li
                                key={word}
                                onClick={() => addWordToSend(word)}
                                className={`cursor-pointer text-black px-4 hover:bg-blue-300 hover:text-black`}
                              >
                                {word}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:mt-0 mt-3">
                  <h1 className="mx-2 md:mx-5">Select Recipient</h1>

                  <input
                    className="text-black text-xl md:text-3xl mx-2 md:mx-5 border-2 border-gray-400 pt-2 px-4 rounded"
                    type="text"
                    placeholder="Search for a friend..."
                    value={searchUsername}
                    onChange={handleFriendInputChange}
                  />

                  {searchUsername && (
                    <ul className="mt-1 bg-white border border-gray-300 mx-2 md:mx-5 ">
                      {filteredFriends &&
                        filteredFriends.map((friend) => (
                          <li
                            key={friend._id}
                            onClick={() => handleSetRecipientId(friend)}
                            className={`cursor-pointer text-black px-4 hover:bg-blue-300 hover:text-black`}
                          >
                            {friend.username}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
              {selectedRecipient ? (
                <button
                  onClick={() => handleSendWord(wordsToSend)}
                  className="bg-green-500 hover:bg-green-800 hover:text-white"
                >
                  Send
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
