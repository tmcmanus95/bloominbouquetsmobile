import { CiCircleCheck } from "react-icons/ci";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoMdFlower,
} from "react-icons/io";

import { useMutation } from "@apollo/client";
import { ACCEPT_FRIEND_REQUEST } from "../utils/mutations";

export default function IndividualFriendRequest({ friendRequest, userId }) {
  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
  const requesterId = friendRequest._id;
  const requesterColor = friendRequest.color;
  console.log("requesterID,", requesterId);
  const handleAcceptFriendRequest = async () => {
    console.log("requesterID,", requesterId);
    console.log("userId,", userId);

    const { data } = await acceptFriendRequest({
      variables: {
        requesterId: requesterId,
        userId: userId,
      },
    });
  };
  return (
    <div className="flex flex-row border-2 border-black m-2 p-1 rounded-lg justify-between items-center">
      <div className="flex flex-row justify-center items-center">
        <IoMdFlower style={{ color: requesterColor }} />
        <h1>{friendRequest.username}</h1>
      </div>
      <div className="justify-center flex flex-row">
        <IoIosCheckmarkCircle
          onClick={handleAcceptFriendRequest}
          className="text-green-700 font-bold hover:text-green-900 hover:cursor-pointer"
        />
        <IoIosCloseCircle className="text-red-700 hover:text-red-900 hover:cursor-pointer" />
      </div>
    </div>
  );
}
