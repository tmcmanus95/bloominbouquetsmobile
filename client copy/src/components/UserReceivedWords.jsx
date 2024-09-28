import Bouquet from "./Bouquet";
import { FaUserEdit } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function UserReceivedWords({ bouquets: initialBouquets }) {
  const [toggleEdit, setToggleEdit] = useState(false);
  const [bouquets, setBouquets] = useState(initialBouquets);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname == "/me") {
      setIsMyProfile(true);
    }
  });

  if (bouquets) {
    if (bouquets.giftedWords) {
      const arrayBouquetWords = bouquets[0].giftedWords.splice(",");
      console.log(arrayBouquetWords);
    }
  }
  const handleToggleEdit = () => {
    setToggleEdit(!toggleEdit);
  };
  const handleDeleteBouquet = (bouquetId) => {
    setBouquets(bouquets.filter((bouquet) => bouquet._id !== bouquetId));
  };

  return (
    <div className="mt-30 dark:text-white flex justify-center flex-col">
      <h1 className="text-center">Received bouquets</h1>
      <div className="border-2 dark:border-white grid md:grid-cols-4 grid-cols-2 text-center">
        <div className="flex flex-row text-base">
          {toggleEdit ? (
            <div className="flex flex-row">
              <IoCloseOutline onClick={handleToggleEdit} />
            </div>
          ) : (
            isMyProfile &&
            bouquets?.length > 0 && (
              <FaUserEdit onClick={handleToggleEdit}></FaUserEdit>
            )
          )}
        </div>

        {bouquets &&
          bouquets.map((bouquet, index) => (
            <Bouquet
              key={index}
              bouquetId={bouquet._id}
              words={bouquet.giftedWords}
              senderUsername={bouquet.sender.username}
              senderId={bouquet.sender._id}
              toggleEdit={toggleEdit}
              onDelete={handleDeleteBouquet}
              isMyProfile={isMyProfile}
            />
          ))}
      </div>
    </div>
  );
}
