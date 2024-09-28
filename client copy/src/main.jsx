import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Error from "./pages/Error";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import HowToPlay from "./pages/HowToPlay.jsx";
import Home from "./pages/Home.jsx";
import SendWord from "./pages/SendWord.jsx";
import OtherProfile from "./pages/OtherProfile.jsx";
import UserSearchResults from "./pages/UserSearchResults.jsx";
import BouquetTesting from "./pages/BouquetTesting.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ResendVerificationLink from "./pages/ResendVerificationLink.jsx";
import BuyGoldenSeeds from "./pages/BuyGoldenSeeds.jsx";
import Shop from "./pages/Shop.jsx";
import AllUserWords from "./pages/AllUserWords.jsx";
import AllFriends from "./pages/AllFriends.jsx";
import SingleWord from "./pages/SingleWord.jsx";
import AllFriendRequests from "./pages/AllFriendRequests.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/me",
        element: <Profile />,
      },
      {
        path: "/me/friendRequests",
        element: <AllFriendRequests />,
      },
      {
        path: "/user/:otherPersonsId",
        element: <OtherProfile />,
      },
      {
        path: "/user/:userId/allWords",
        element: <AllUserWords />,
      },
      {
        path: "/user/:userId/friends",
        element: <AllFriends />,
      },
      { path: "/sendABouquet/:userId", element: <SendWord /> },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/usersearch/:searchTerm",
        element: <UserSearchResults />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/howToPlay",
        element: <HowToPlay />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/bouquetTesting",
        element: <BouquetTesting />,
      },
      {
        path: "/verifyEmail/:token",
        element: <VerifyEmail />,
      },
      {
        path: "/resetPassword/:token",
        element: <ResetPassword />,
      },
      {
        path: "/forgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "/resendEmailVerification",
        element: <ResendVerificationLink />,
      },
      {
        path: "/buyGoldenSeeds",
        element: <BuyGoldenSeeds />,
      },
      {
        path: "/singleWord/:word",
        element: <SingleWord />,
      },

      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
    errorElement: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
