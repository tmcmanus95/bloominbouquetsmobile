import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_USERS_FRIENDS } from "../utils/queries";
import { useState, useEffect } from "react";
import { IoMdFlower } from "react-icons/io";
import { IoFlowerOutline } from "react-icons/io5";

import Loading from "../components/Loading";

export default function AllFriends() {
  const { userId } = useParams();
  const { error, loading, data } = useQuery(QUERY_USERS_FRIENDS, {
    variables: { userId: userId },
  });
  const [friends, setFriends] = useState([]);
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("");
  if (data) {
    console.log("data", data);
  }
  useEffect(() => {
    setFriends(data?.user?.friends);
    setUsername(data?.user?.username);
    setColor(data?.user?.color);
  }, [data]);
  return (
    <div className="mt-20">
      <div className="flex flex-row justify-center md:text-5xl text-4xl">
        <IoFlowerOutline style={{ color: color }} className="mr-2" />

        <h1 className="mb-5">{username}'s Words</h1>
      </div>
      {friends ? (
        friends.map((friend, index) => (
          <div
            key={index}
            className="flex flex-row justify-center p-1 rounded-lg border-2 m-2 overflow-hidden"
            style={{ borderColor: friend.color }}
          >
            <Link
              to={`/user/${friend._id}`}
              className="flex flex-row items-center"
            >
              <IoMdFlower style={{ color: friend.color }} className="mr-2" />
              <div className="flex flex-row">{friend.username}</div>
            </Link>
          </div>
        ))
      ) : (
        <Loading className="mt-20" />
      )}
    </div>
  );
}
