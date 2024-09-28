import { Link } from "react-router-dom";
import { useState } from "react";
import Auth from "../utils/auth";
import { GiHamburgerMenu } from "react-icons/gi";
import UserSearchBar from "./UserSearchBar";
import { RiUserSearchLine } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";
import { IoFlowerOutline } from "react-icons/io5";
import { useQuery } from "@apollo/client";
import { NAVBAR_QUERY } from "../utils/queries";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const { data, loading, error } = useQuery(NAVBAR_QUERY);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleUserSearch = () => {
    setUserSearchOpen(!userSearchOpen);
  };
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mx-auto px-4 md:flex items-center dark:bg-green-900 bg-green-600 gap-6 py-1">
      <div className="flex w-full items-center dark:text-white">
        <Link to="/">
          <img className="h-5 lg:h-10 mr-5" src="/flowerfavicon.png"></img>{" "}
        </Link>
        {data ? (
          <Link to="/me">
            <IoFlowerOutline style={{ color: data?.me?.color }} />
          </Link>
        ) : (
          <></>
        )}
        <div className="md:hidden flex items-center ml-5 text-right dark:text-white">
          <GiHamburgerMenu
            onClick={toggleMenu}
            style={{ fontSize: "24px", cursor: "pointer" }}
          />
        </div>

        <div className="hidden md:gap-5 md:flex md:flex-row ">
          {data ? (
            <div className="hidden md:gap-5 md:flex md:flex-row">
              {Auth.loggedIn ? (
                <Link
                  to="/me"
                  className="hover:bg-green-900 lg:p-2 rounded-lg dark:hover:bg-green-950"
                >
                  Welcome {data?.me?.username}
                </Link>
              ) : (
                <Link
                  className="hover:bg-green-900 dark:hover:bg-green-950 lg:p-2 rounded-lg"
                  to="/"
                >
                  Bloomin Bouquets
                </Link>
              )}
            </div>
          ) : (
            <div className="hidden md:gap-5 md:flex md:flex-row">
              <Link
                className="hover:bg-green-900 dark:hover:bg-green-950 lg:p-2 rounded-lg"
                to="/"
              >
                Bloomin Bouquets
              </Link>
            </div>
          )}

          <Link
            to="/howToPlay"
            className="hover:bg-green-900 dark:hover:bg-green-950 lg:p-2 rounded-lg"
          >
            How To Play
          </Link>
          <Link
            to="/contact"
            className="hover:bg-green-900 dark:hover:bg-green-950 lg:p-2 rounded-lg"
          >
            Contact
          </Link>
          {Auth.loggedIn() ? (
            <>
              <Link
                to="/buyGoldenSeeds"
                className="hover:bg-green-900 dark:hover:bg-green-950 lg:p-2 rounded-lg"
              >
                Buy More Seeds
              </Link>

              <Link
                to="/shop"
                className="hover:bg-green-900  dark:hover:bg-green-950 lg:p-2 rounded-lg"
              >
                Shop
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
        {userSearchOpen ? (
          <div className="mx-5 flex justify-center align-center items-center">
            <UserSearchBar />
            <IoCloseOutline onClick={toggleUserSearch} />
          </div>
        ) : (
          <RiUserSearchLine onClick={toggleUserSearch} />
        )}
        {/* <div className="mx-5 flex justify-center align-center items-center"></div> */}
        {menuOpen && (
          <div className="absolute inset-x-0 md:relative top-full md:top-auto md:left-auto md:flex flex-col items-center  space-x-1 pb-3 md:pb-0  dark:bg-green-900 bg-green-600">
            <Link
              onClick={toggleMenu}
              to="/howToPlay"
              className="py-2 px-3 block w-full hover:bg-green-950 hover:text-white "
            >
              How To Play
            </Link>
            <Link
              onClick={toggleMenu}
              to="/contact"
              className="py-2 px-3 block w-full hover:bg-green-950 hover:text-white"
            >
              Contact
            </Link>
            {Auth.loggedIn() ? (
              <>
                <Link
                  to="/shop"
                  onClick={toggleMenu}
                  className="py-2 px-3 block w-full hover:bg-green-950 hover:text-white"
                >
                  Shop
                </Link>
                <Link
                  to="/buyGoldenSeeds"
                  onClick={toggleMenu}
                  className="py-2 px-3 block w-full hover:bg-green-950 hover:text-white"
                >
                  Buy More Seeds
                </Link>
              </>
            ) : (
              <></>
            )}

            {Auth.loggedIn() ? (
              <>
                <Link
                  onClick={toggleMenu}
                  to="/me"
                  className="py-2 px-3 block w-full hover:bg-green-950 hover:text-white"
                >
                  View My Profile
                </Link>
                <button
                  onClick={logout}
                  className="btn text-left py-2 px-3 block w-full hover:bg-green-950 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 px-3 block w-full hover:bg-green-900 dark:hover:bg-green-950"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="py-2 px-3 block w-full hover:bg-green-900 "
                  onClick={toggleMenu}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="hidden md:flex space-x-4">
        {Auth.loggedIn() ? (
          <>
            <Link to="/me">
              <button className="hover:bg-green-900 dark:hover:bg-green-950 p-2 rounded-lg">
                Profile
              </button>
            </Link>
            <button
              onClick={logout}
              className="hover:bg-green-900 dark:hover:bg-green-950 p-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="hover:bg-green-900 dark:hover:bg-green-950 p-2 rounded-lg">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="hover:bg-green-900 dark:hover:bg-green-950 p-2 rounded-lg">
                Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
