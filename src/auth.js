import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConnectDB } from "./libs/config/db";
import UserModel from "./libs/models/UserModel";
import bcrypt from "bcryptjs";
import { authConfig } from "./libs/config/auth.config";

//Creating a function that'll handle the retrieval and collecting of the credentials
const login = async (credentials) => {
  try {
    ConnectDB();
    const user = await UserModel.findOne({ username: credentials.username });

    if (!user) {
      throw new Error("Username not found");
    }

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Password is not correct");
    }

    return user; //This means what if everything is okay then return user
  } catch (err) {
    console.log(err);
    throw new Error("Failed to Login from auth");
  }
};

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    Google,
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(user, account, profile);
      //console.log("Profile data:", profile);
      if (account.provider === "google") {
        ConnectDB();
        try {
          const user = await UserModel.findOne({ email: profile.email });

          if (!user) {
            const newUser = new UserModel({
              username: profile.name,
              email: profile.email,
              image: profile.image,
            });

            await newUser.save();
          }
        } catch (err) {
          console.log(err);
          return false;
        }
      }
      return true;
    },
    ...authConfig.callbacks,
  },
});
