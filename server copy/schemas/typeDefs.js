const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    password: String
    color: String
    dailyBoard: String
    lastBoardGeneratedAt: String
    dailyShuffleCount: Float
    lastShuffleReset: String
    goldenSeeds: Float
    friendRequests: [User]
    friends: [User]
    words: [String]
    giftedWords: [GiftedWords]
    isVerified: Boolean
    emailVerificationToken: String
    passwordResetToken: String
    passwordResetExpires: String
    orders: [Order]
}

type GiftedWords {
    _id: ID
    giftedWords: [String]
    sender: User
}

type SeedPackage {
    _id: ID
    quantity: Int
    price: Float
}

type Order {
    _id: ID
    purchaseDate: String
    seedPackage: SeedPackage
    status: String
}

type Checkout {
    session: ID
}

type Auth {
    token: ID!
    user: User
}

type AuthPayload {
    token: String
    user: User
}
type CheckWordValidityResponse {
  success: Boolean!
  message: String
  userWord: String
}

type Query {
    users: [User]
    user(userId: ID!): User
    me: User
    meId: User
    seedPackages: [SeedPackage]
    usersFriendRequests(userId: ID!): User
    searchUsers(username: String): User
    dailyRandomization: User

}
    
type Mutation {
    addUser(username: String!, email: String!, password: String!, color: String): Auth
    removeUser(userId: ID!): User
    editUserColor(userId: ID!, color: String): User
    login(email: String!, password: String!): Auth
    sendFriendRequest(recipientId: ID!, userId: ID!): User
    acceptFriendRequest(requesterId: ID!, userId: ID!): User
    addFriend(newFriendId: ID!, userId: ID!): User
    addWord(word: String!, userId: ID!): User
    sendWord(giftedWords: String!, recipientId: ID!, userId: ID!): User
    deleteBouquet(giftedWordsId: ID!): GiftedWords
    updateDailyBoard(userId: ID!, dailyBoard: String!): User
    addGoldenSeeds(userId: ID!, seeds: Int!): User
    shuffleBoard(userId: ID!): User
    verifyEmail(token: String!, userId: ID!): AuthPayload
    forgotPassword(email: String!): Boolean
    resendEmailVerification(email: String!): Boolean
    resetPassword(token: String!, email: String!, newPassword: String!): AuthPayload
    checkout(seedPackageId: ID!): Checkout
    buyWord(word: String): User
    checkWordValidity(word: String!, userId: ID): CheckWordValidityResponse

}
`;
module.exports = typeDefs;
