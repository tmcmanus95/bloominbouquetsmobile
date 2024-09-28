const { User, GiftedWords, Order, SeedPackage } = require("../models");
const crypto = require("crypto");
const { signToken, AuthenticationError } = require("../utils/auth");
const getDailyBoard = require("../utils/getDailyBoard");
const shuffleCountToSeedReduction = require("../utils/shuffleCountToSeedReduction");
const wordLengthToSeeds = require("../utils/wordLengthToSeeds");
const { sendEmail } = require("../utils/sendEmail");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { wordList } = require("../assets/wordList");

const resolvers = {
  Query: {
    users: async () => {
      return User.find()
        .populate("friendRequests")
        .populate("friends")
        .populate({
          path: "giftedWords",
          model: "GiftedWords",
        })
        .populate({
          path: "giftedWords",
          populate: {
            path: "sender",
            model: "User",
          },
        });
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId })
        .populate("friendRequests")
        .populate("friends")
        .populate("giftedWords")
        .populate({
          path: "giftedWords",
          populate: {
            path: "sender",
            model: "User",
          },
        });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
          .populate("friendRequests")
          .populate("friends")
          .populate("giftedWords")
          .populate({
            path: "giftedWords",
            populate: {
              path: "sender",
              model: "User",
            },
          });
      }
      throw AuthenticationError;
    },
    meId: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    seedPackages: async () => {
      return SeedPackage.find();
    },
    usersFriendRequests: async (parent, { userId }) => {
      return User.findOne({ _id: userId }).populate("friendRequests");
    },
    searchUsers: async (parent, { username }) => {
      return User.findOne({ username: username });
    },
    dailyRandomization: async (parent, args, context) => {
      try {
        if (context.user) {
          const user = await User.findOne({ _id: context.user._id });
          const now = new Date();
          const lastGenerated = user.lastBoardGeneratedAt;

          const isSameDay = (date1, date2) => {
            return (
              date1.getFullYear() === date2.getFullYear() &&
              date1.getMonth() === date2.getMonth() &&
              date1.getDate() === date2.getDate()
            );
          };

          if (!lastGenerated || !isSameDay(now, lastGenerated)) {
            const newBoard = getDailyBoard();
            user.dailyBoard = newBoard;
            user.dailyShuffleCount = 0;
            user.lastBoardGeneratedAt = now;
            user.lastShuffleReset = now;
            await user.save();
          }

          return user;
        }
      } catch (err) {
        console.log("Could not get daily board", err);
        throw new Error("Could not get daily board");
      }
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password, color }) => {
      try {
        const emailVerificationToken = crypto.randomBytes(20).toString("hex");

        const user = await User.create({
          username,
          email,
          password,
          color,
          emailVerificationToken: emailVerificationToken,
          isVerified: false,
        });
        const verificationUrl = `${process.env.WEBSITE_URL}/verifyEmail/${emailVerificationToken}`;
        await sendEmail({
          to: email,
          subject: "Bloomin' Bouquets Account Email Verification 🌹💐🌸🥀",
          text: `Please verify your email by clicking the following link: ${verificationUrl}`,
        });

        const token = signToken({
          email: user.email,
          name: user.username,
          _id: user._id,
        });

        return { token, user };
      } catch (error) {
        console.error("Error adding user:", error);
        throw new Error("Failed to add user");
      }
    },
    editUserColor: async (parent, { userId, color }, context) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $set: { color } },
          { new: true }
        );

        return updatedUser;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to edit color");
      }
    },
    removeUser: async (parent, { userId }) => {
      return User.findOneAndDelete({ _id: userId });
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    sendFriendRequest: async (_, { userId, recipientId }, context) => {
      try {
        const sender = await User.findById(userId);
        if (!sender) {
          throw new Error("User not found");
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
          throw new Error("Recipient not found");
        }

        if (
          recipient.friends.includes(userId) ||
          recipient.friendRequests.includes(userId)
        ) {
          throw new Error("Friend request already sent or already friends");
        }

        recipient.friendRequests.push(userId);

        await recipient.save();

        return true;
      } catch (error) {
        throw new Error(`Failed to send friend request: ${error.message}`);
      }
    },

    acceptFriendRequest: async (_, { requesterId, userId }, context) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        if (!user.friendRequests.includes(requesterId)) {
          throw new Error("No pending friend request found");
        }

        user.friends.push(requesterId);

        user.friendRequests = user.friendRequests.filter(
          (request) => request.toString() !== requesterId.toString()
        );

        await user.save();
        const requester = await User.findById(requesterId);

        requester.friends.push(userId);

        requester.friendRequests = requester.friendRequests.filter(
          (request) => request.toString() !== userId.toString()
        );
        await requester.save();

        return user;
      } catch (error) {
        throw new Error(`Failed to accept friend request: ${error.message}`);
      }
    },

    addFriend: async (_, { newFriendId, userId }, context) => {
      // const { userId } = "662703cbcfb6bc123980495f";

      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        const friendId = newFriendId;
        const friend = await User.findById(friendId);
        if (!friend) {
          throw new Error("Friend not found");
        }

        if (userId === friendId) {
          throw new Error("Cannot add yourself as a friend");
        }

        if (user.friends.includes(friendId)) {
          throw new Error("Already friends");
        }

        user.friends.push(friendId);
        await user.save();

        return user;
      } catch (error) {
        throw new Error(`Failed to add friend: ${error.message}`);
      }
    },
    addWord: async (_, { word, userId }, context) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        if (!wordList.includes(word.toLowerCase())) {
          throw new Error("word not there!");
        }
        if (!user.words.includes(word)) {
          user.words.push(word);
        }
        const seeds = wordLengthToSeeds(word.length);
        user.goldenSeeds += seeds;
        await user.save();

        return user;
      } catch (error) {
        throw new Error(`Could not add word: ${error.message}`);
      }
    },
    sendWord: async (_, { giftedWords, recipientId, userId }, context) => {
      //const userId = context
      const sender = userId;
      try {
        const gift = await GiftedWords.create({ giftedWords, sender });
        const recipient = await User.findById(recipientId);
        recipient.giftedWords.push(gift);
        await recipient.save();
        return true;
      } catch (error) {
        throw new Error("could not send word");
      }
    },
    deleteBouquet: async (_, { giftedWordsId }, context) => {
      return await GiftedWords.findByIdAndDelete({ _id: giftedWordsId });
    },
    updateDailyBoard: async (_, { userId, dailyBoard }, context) => {
      try {
        const user = await User.findById(userId);
        const newBoard = dailyBoard;
        user.dailyBoard = newBoard;
        user.save();
        return user;
      } catch (err) {
        console.log("Could not update board", err);
      }
    },
    addGoldenSeeds: async (_, { userId, seeds }, context) => {
      try {
        const user = await User.findById(userId);
        user.goldenSeeds += seeds;
        user.save();
        return user;
      } catch (err) {
        console.log("could not add seeds");
      }
    },
    shuffleBoard: async (parent, { userId }, context) => {
      try {
        const user = await User.findById(userId);

        if (!user) {
          console.log("User not found");
          return;
        }

        const now = new Date();
        const lastShuffleReset = user.lastShuffleReset;
        const dailyShuffleCount = user.dailyShuffleCount || 0;

        const newBoard = getDailyBoard();
        user.dailyBoard = newBoard;
        user.lastShuffleReset = now;

        const seedCost = shuffleCountToSeedReduction(dailyShuffleCount);
        if (user.goldenSeeds < seedCost) {
          return;
        }

        user.goldenSeeds -= seedCost;
        user.dailyShuffleCount = dailyShuffleCount + 1;
        await user.save();
        return user;
      } catch (err) {
        console.log("Could not shuffle board", err);
      }
    },
    verifyEmail: async (parent, { token, userId }, context) => {
      try {
        const user = await User.findOne({ emailVerificationToken: token });

        if (!user) {
          throw AuthenticationError;
        }
        if (user._id == userId) {
          user.isVerified = true;
          user.emailVerificationToken = null;
        }

        await user.save();

        return { user };
      } catch (error) {
        console.error("Error verifying email:", error);
        throw AuthenticationError;
      }
    },

    forgotPassword: async (parent, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${process.env.WEBSITE_URL}/resetPassword/${resetToken}`;
        if (user) {
          await sendEmail({
            to: email,
            subject: "Password Reset",
            text: `Please reset your password by clicking the following link: ${resetUrl}`,
          });
          return true;
        } else {
          return;
        }
      } catch (error) {
        console.error("Error in forgot password:", error);
        throw new Error("Failed to process forgot password");
      }
    },
    resendEmailVerification: async (parent, { email }) => {
      const user = await User.findOne({ email });
      const emailVerificationToken = crypto.randomBytes(20).toString("hex");
      if (user) {
        user.emailVerificationToken = emailVerificationToken;
        const verificationUrl = `${process.env.WEBSITE_URL}/verifyEmail/${emailVerificationToken}`;
        await sendEmail({
          to: email,
          subject: "Bubbles. Account Email Verification",
          text: `Please verify your email by clicking the following link: ${verificationUrl}`,
        });
      }
      await user.save();
    },

    resetPassword: async (parent, { email, token, newPassword }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid or expired token");
        }

        if (user.passwordResetToken === token) {
          user.password = newPassword;
          user.passwordResetToken = null;
          user.passwordResetExpires = null;
        } else {
          return;
        }
        await user.save();

        // const authToken = signToken(user);
        // return { token: authToken, user };
        return user;
      } catch (error) {
        console.error("Error resetting password:", error);
        throw new Error("Failed to reset password");
      }
    },
    checkout: async (parent, { seedPackageId }, context) => {
      const url = new URL(context.headers.referer).origin;

      // Fetch the seed package from the database
      const seedPackage = await SeedPackage.findById(seedPackageId);

      if (!seedPackage) {
        throw new Error("Seed package not found");
      }

      const line_item = {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Seed Package ${seedPackage.quantity}`,
          },
          unit_amount: seedPackage.price * 100,
        },
        quantity: 1,
      };

      const order = await Order.create({
        seedPackage: seedPackageId,
        user: context.user._id,
        purchaseDate: new Date(),
        status: "pending",
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [line_item],
        mode: "payment",
        success_url: `${url}/`,
        cancel_url: `${url}/error`,
        metadata: {
          userId: context.user._id.toString(),
          seedPackageId: seedPackage._id.toString(),
          orderId: order._id.toString(),
        },
      });

      return { session: session.id };
    },
    buyWord: async (parent, { word }, context) => {
      try {
        if (context.user) {
          const user = await User.findById({ _id: context.user._id });
          if (!user.words.includes(word)) {
            user.words.unshift(word);
            user.goldenSeeds -= wordLengthToSeeds(word.length);
            await user.save();
            return user;
          }
        }
      } catch (error) {
        console.log("could not buy word", error);
      }
    },
    checkWordValidity: async (_, { word, userId }, context) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          if (!wordList.includes(word.toLowerCase())) {
            return { success: false, message: "Word not in the dictionary" };
          } else {
            return { success: true, message: "Word is valid", userWord: word };
          }
        }
        if (!wordList.includes(word.toLowerCase())) {
          return { success: false, message: "Word not in the dictionary" };
        }
        if (user.words.includes(word)) {
          return { success: true, message: "Word already added" };
        }

        return { success: true, message: "Word is valid", userWord: word };
      } catch (error) {
        return {
          success: false,
          message: `Could not ascertain word validity: ${error.message}`,
        };
      }
    },
  },
};

module.exports = resolvers;
