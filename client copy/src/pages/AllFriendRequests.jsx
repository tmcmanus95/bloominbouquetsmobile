import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USERS_FRIEND_REQUESTS } from "../utils/queries";
import { useState, useEffect } from "react";
import { ACCEPT_FRIEND_REQUEST } from "../utils/mutations";
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoMdFlower,
} from "react-icons/io";
import { Link } from "react-router-dom";

export default function AllFriendRequests() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [userId, setUserId] = useState("");
  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
  const { loading, error, data } = useQuery(QUERY_USERS_FRIEND_REQUESTS);
  useEffect(() => {
    if (data) {
      setFriendRequests(data.me.friendRequests);
      setUserId(data.me._id);
    }
  }, [data]);
  const handleAcceptFriendRequest = async (requesterId) => {
    const { data } = await acceptFriendRequest({
      variables: {
        requesterId: requesterId,
        userId: userId,
      },
    });
    setFriendRequests(
      friendRequests.filter((request) => request._id !== requesterId)
    );
  };

  return (
    <div className="flex justify-center flex-col md:text-xl text-base ">
      <h1 className="text-center text-3xl m-5">Your Friend Requests</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 justify-center ml-2 border-2 border-black dark:border-white m-2">
        {friendRequests &&
          friendRequests.map((friendRequest, index) => (
            <div>
              <div className="flex flex-row border-2 border-black m-2 p-1 rounded-lg justify-between items-center">
                <div className="flex flex-row justify-center items-center">
                  <IoMdFlower style={{}} />
                  <h1>{friendRequest.username}</h1>
                </div>
                <div className="justify-center flex flex-row">
                  <IoIosCheckmarkCircle
                    onClick={() => handleAcceptFriendRequest(friendRequest._id)}
                    className="text-green-700 font-bold hover:text-green-900 hover:cursor-pointer"
                  />
                  <IoIosCloseCircle className="text-red-700 hover:text-red-900 hover:cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
      </div>
      {friendRequests.length == 0 && (
        <div className="text-center mt-10 text-2xl">
          <div>No pending friend requests</div>
          <div className="flex flex-col items-center mt-2">
            <Link to={"/"}>
              <h4 className="hover:bg-green-300 hover:text-black rounded-lg p-2">
                Home
              </h4>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
