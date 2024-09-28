import { gql } from "@apollo/client";
export const ADD_USER = gql`
  mutation addUser(
    $username: String!
    $email: String!
    $password: String!
    $color: String
  ) {
    addUser(
      username: $username
      email: $email
      password: $password
      color: $color
    ) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const EDIT_USER_COLOR = gql`
  mutation Mutation($userId: ID!, $color: String) {
    editUserColor(userId: $userId, color: $color) {
      _id
      username
      color
    }
  }
`;
export const ADD_WORD = gql`
  mutation Mutation($word: String!, $userId: ID!) {
    addWord(word: $word, userId: $userId) {
      _id
      username
      words
      goldenSeeds
    }
  }
`;

export const SEND_WORD = gql`
  mutation Mutation($giftedWords: String!, $recipientId: ID!, $userId: ID!) {
    sendWord(
      giftedWords: $giftedWords
      recipientId: $recipientId
      userId: $userId
    ) {
      _id
      username
    }
  }
`;
export const SEND_FRIEND_REQUEST = gql`
  mutation Mutation($recipientId: ID!, $userId: ID!) {
    sendFriendRequest(recipientId: $recipientId, userId: $userId) {
      _id
    }
  }
`;
export const ACCEPT_FRIEND_REQUEST = gql`
  mutation Mutation($requesterId: ID!, $userId: ID!) {
    acceptFriendRequest(requesterId: $requesterId, userId: $userId) {
      _id
      username
    }
  }
`;
export const UPDATE_DAILY_BOARD = gql`
  mutation Mutation($userId: ID!, $dailyBoard: String!) {
    updateDailyBoard(userId: $userId, dailyBoard: $dailyBoard) {
      dailyBoard
    }
  }
`;

export const SHUFFLE_BOARD = gql`
  mutation Mutation($userId: ID!) {
    shuffleBoard(userId: $userId) {
      _id
      username
      dailyBoard
      dailyShuffleCount
      lastShuffleReset
      goldenSeeds
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation Mutation($token: String!, $userId: ID!) {
    verifyEmail(token: $token, userId: $userId) {
      token
      user {
        _id
        username
        email
        isVerified
      }
    }
  }
`;

export const SEND_PASSWORD_RESET_LINK = gql`
  mutation Mutation($email: String!) {
    forgotPassword(email: $email)
  }
`;
export const RESEND_VERIFICATION_LINK = gql`
  mutation Mutation($email: String!) {
    resendEmailVerification(email: $email)
  }
`;
export const RESET_PASSWORD = gql`
  mutation Mutation($token: String!, $email: String!, $newPassword: String!) {
    resetPassword(token: $token, email: $email, newPassword: $newPassword) {
      token
      user {
        _id
        username
      }
    }
  }
`;
export const LOAD_STRIPE = gql`
  mutation Checkout($seedPackageId: ID!) {
    checkout(seedPackageId: $seedPackageId) {
      session
    }
  }
`;
export const DELETE_BOUQUET = gql`
  mutation Mutation($giftedWords: ID!) {
    deleteBouquet(giftedWordsId: $giftedWords) {
      _id
      giftedWords
    }
  }
`;
export const BUY_WORD = gql`
  mutation Mutation($word: String) {
    buyWord(word: $word) {
      _id
      goldenSeeds
    }
  }
`;
export const CHECK_WORD_VALIDITY = gql`
  mutation Mutation($word: String!, $userId: ID) {
    checkWordValidity(word: $word, userId: $userId) {
      success
      message
      userWord
    }
  }
`;
