import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { EDIT_USER_COLOR } from "../utils/mutations";
import { IoFlowerOutline, IoCloseOutline } from "react-icons/io5";

import { FaUserEdit } from "react-icons/fa";
import { useState } from "react";
import ProfileWords from "../components/ProfileWords";
import ProfilesReceivedFriendRequestsList from "../components/ProfilesReceivedFriendRequestsList";
import ProfileFriends from "../components/ProfileFriends";
import { ColorPicker } from "antd";
import UserReceivedWords from "../components/UserReceivedWords";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

export default function Profile() {
  const { loading, data } = useQuery(QUERY_ME);
  const [toggleEdit, setToggleEdit] = useState(false);
  let userBackgroundColor = "";
  if (data) {
    userBackgroundColor = data.me.color;
  }
  const [editUserColor, error] = useMutation(EDIT_USER_COLOR);
  const handleEditUserColor = async (value) => {
    const { r, g, b } = value.metaColor;
    function rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    const hexColor = rgbToHex(r, g, b);
    let hex = hexColor.split(".");
    let userId = data.me._id;
    try {
      const { data } = await editUserColor({
        variables: { userId: userId, color: hex[0] },
      });
    } catch (error) {
      console.log("Could not edit color", error);
    }
    setToggleEdit(!toggleEdit);
  };
  function handleToggleEdit() {
    setToggleEdit(!toggleEdit);
  }
  return (
    <div className="m-3">
      {data ? (
        <div className="dark:text-white ">
          <div className="justify-center flex flex-col ">
            <div className="md:text-4xl flex flex-row items-center justify-between border-black dark:border-white border-2 p-5 m-2 mt-2">
              <div className="flex flex-row">
                <IoFlowerOutline style={{ color: userBackgroundColor }} />
                <h1>{data.me.username}</h1>
              </div>
              <div className="flex flex-row text-base">
                {toggleEdit ? (
                  <div className="flex flex-row">
                    <p className=" mr-3 ml-3">Current Color:</p>
                    <ColorPicker
                      onChangeComplete={(value) => handleEditUserColor(value)}
                      defaultValue={data.me.color}
                    />
                    <IoCloseOutline onClick={handleToggleEdit} />
                  </div>
                ) : (
                  <FaUserEdit onClick={handleToggleEdit}></FaUserEdit>
                )}
              </div>
            </div>
          </div>
          <div className="justify-start">
            <ProfileFriends friends={data.me.friends} userId={data.me._id} />
          </div>

          <div>
            <ProfilesReceivedFriendRequestsList
              friendRequests={data.me.friendRequests}
              userId={data.me._id}
            />
          </div>

          <div className="justify-start">
            <ProfileWords words={data.me.words} userId={data.me._id} />
          </div>
          <div>
            <UserReceivedWords bouquets={data.me.giftedWords} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-20">
          <Loading />
        </div>
      )}
    </div>
  );
}
