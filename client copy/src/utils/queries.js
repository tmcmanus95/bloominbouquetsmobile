import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query Me {
    me {
      _id
      username
      color
      friendRequests {
        _id
        username
        color
      }
      friends {
        _id
        username
        color
      }
      words
      giftedWords {
        _id
        giftedWords
        sender {
          _id
          username
        }
      }
    }
  }
`;

export const QUERY_USER = gql`
  query SearchUsers($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      friends {
        _id
        username
      }
      words
      color
      giftedWords {
        _id
        giftedWords
        sender {
          _id
          username
        }
      }
    }
    me {
      _id
      color
      friends {
        _id
        username
      }
    }
  }
`;

export const QUERY_MY_WORDS_AND_MY_FRIENDS = gql`
  query Query {
    me {
      _id
      words
      username
      friends {
        _id
        username
      }
    }
  }
`;

export const QUERY_USERS = gql`
  query SearchUsers($username: String) {
    searchUsers(username: $username) {
      _id
      username
    }
  }
`;
export const QUERY_MEID = gql`
  query Query {
    meId {
      _id
      username
      isVerified
    }
  }
`;

export const QUERY_USER_FRIEND_REQUESTS = gql`
  query Query($userId: ID!) {
    usersFriendRequests(userId: $userId) {
      friendRequests {
        _id
        username
        color
      }
    }
  }
`;
export const NAVBAR_QUERY = gql`
  query Query {
    me {
      _id
      username
      color
    }
  }
`;
export const GET_DAILY_BOARD = gql`
  query DailyRandomization {
    dailyRandomization {
      _id
      username
      dailyBoard
      lastBoardGeneratedAt
      color
      goldenSeeds
      words
      dailyShuffleCount
    }
  }
`;
export const QUERY_SEED_PACKAGES = gql`
  query SeedPackages {
    seedPackages {
      _id
      quantity
      price
    }
  }
`;
export const QUERY_SHOP_ME = gql`
  query User {
    me {
      _id
      goldenSeeds
      words
    }
  }
`;
export const QUERY_ALL_USER_WORDS = gql`
  query User($userId: ID!) {
    user(userId: $userId) {
      words
      color
      username
    }
  }
`;
export const QUERY_USERS_FRIENDS = gql`
  query User($userId: ID!) {
    user(userId: $userId) {
      username
      color
      friends {
        _id
        username
        color
      }
    }
  }
`;
export const QUERY_USERS_FRIEND_REQUESTS = gql`
  query User {
    me {
      _id
      username
      friendRequests {
        _id
        username
      }
    }
  }
`;
