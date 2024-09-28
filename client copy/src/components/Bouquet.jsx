import { bouquetsImageStylings } from "../utils/bouquetsImageStylings";
import { flowerSourceFinder } from "../utils/flowerSourceFinder";
import { wordsToStemMatching } from "../utils/wordsToStemMatching";
import { Link, useLocation } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";
import { useMutation } from "@apollo/client";
import { DELETE_BOUQUET } from "../utils/mutations";

export default function Bouquet({
  words,
  senderUsername,
  senderId,
  toggleEdit,
  bouquetId,
  onDelete,
  isMyProfile,
}) {
  let bouquet;

  if (!words[1]) {
    bouquet = words[0]?.split(",");
  } else {
    bouquet = words;
  }
  const [deleteBouquet, error] = useMutation(DELETE_BOUQUET);
  const handleDeleteBouquet = async () => {
    console.log("I will delete bouquet");
    console.log("bouquetId", bouquetId);
    const { data } = await deleteBouquet({
      variables: { giftedWords: bouquetId },
    });
    onDelete(bouquetId);
  };
  const wordAmount = bouquet?.length;
  console.log("toggle edit is", toggleEdit);
  return (
    <div className="m-5 dark:border-white border-2">
      <Link to={`/user/${senderId}`}>
        <h1>From: {senderUsername}</h1>
      </Link>
      {isMyProfile && toggleEdit && (
        <IoIosCloseCircle
          className="text-red-500 hover:text-red-900"
          onClick={handleDeleteBouquet}
        />
      )}

      <div className=" flex flex-row justify-center">
        {bouquet?.map((word, index) => (
          <img
            key={index}
            className={`relative hover:scale-75 md:hover:scale-125 md:scale-100 scale-50 ${bouquetsImageStylings(
              wordAmount,
              index
            )}`}
            src={flowerSourceFinder(word.length)}
            alt="Flower"
          ></img>
        ))}
      </div>
      <div className="flex justify-center">
        {wordAmount > 0 && (
          <img
            className="md:-mt-2 md:scale-100 -mt-4 scale-75"
            src={wordsToStemMatching(wordAmount)}
          ></img>
        )}
      </div>
      <div>
        <h2>
          {bouquet?.map((word, index) => (
            <span key={index}>{word} </span>
          ))}
        </h2>
      </div>
    </div>
  );
}
