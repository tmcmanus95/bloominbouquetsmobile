import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { QUERY_USER } from "../utils/queries";
import ProfileWords from "../components/ProfileWords";
import { IoMdPersonAdd, IoMdFlower } from "react-icons/io";

import { SEND_FRIEND_REQUEST } from "../utils/mutations";
import { GiFlowerPot } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useState } from "react";
import UserReceivedWords from "../components/UserReceivedWords";

export default function OtherProfile() {
  const { otherPersonsId } = useParams();
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  let friendColor = "";
  let userColor = "";
  const {
    loading,
    data,
    error: queryUserError,
  } = useQuery(QUERY_USER, {
    variables: {
      userId: otherPersonsId,
    },
  });

  if (data && otherPersonsId == data.me._id) {
    window.location.assign("/me");
  }
  let isFriend = false;
  let myId;
  const [sendFriendRequest, error] = useMutation(SEND_FRIEND_REQUEST);
  if (data) {
    myId = data.me._id;
    friendColor = data.user.color;
    userColor = data.me.color;
    for (let i = 0; i < data.me.friends.length; i++) {
      if (data.me.friends[i]._id === otherPersonsId) {
        isFriend = true;
      }
    }
  }
  const handleAddFriend = async () => {
    const { data } = await sendFriendRequest({
      variables: {
        userId: myId,
        recipientId: otherPersonsId,
      },
    });
    setFriendRequestSent(true);
  };
  return (
    <div className="m-3">
      {data ? (
        <div className="dark:text-white">
          <div className="flex text-3xl border-2 border-black dark:border-white m-2 md:mt-16 mt-10">
            <div className="flex flex-row items-center">
              <IoMdFlower
                className="text-5xl "
                style={{ color: friendColor }}
              />
              <div className="flex-col flex">
                <h1 className="md:text-3xl text-xl">{data.user.username}</h1>
                {isFriend ? (
                  <div className="flex flex-row">
                    <IoMdFlower
                      className="text-xs"
                      style={{ color: userColor }}
                    />
                    <h6 className="text-xs">Friends</h6>
                  </div>
                ) : !friendRequestSent ? (
                  <IoMdPersonAdd
                    onClick={handleAddFriend}
                    className="text-xs"
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>

            {isFriend ? (
              <Link to={`/sendABouquet/${data.user._id}`}>
                <div className="flex flex-row ml-3 text-sm m-3 rounded-lg hover:pointer-cursor hover:bg-green-500 bg-green-100 dark:bg-green-500 dark:hover:bg-green-900 p-3 flex-wrap ">
                  <GiFlowerPot />
                  <p className="flex text-center">
                    Send a bouquet to {data.user.username}
                  </p>
                </div>
              </Link>
            ) : (
              <></>
            )}
          </div>
          <div>
            <ProfileWords words={data.user.words} userId={data.user._id} />
          </div>
          <div>
            <UserReceivedWords bouquets={data.user.giftedWords} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
