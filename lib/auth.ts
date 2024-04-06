import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const existingUser = await db.user.findUnique({
            where: { email: credentials?.email },
          });

          if (!existingUser) {
            return null;
          }

          const passwordMatch = await compare(
            credentials.password,
            existingUser.password
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: `${existingUser.id}`,
            fname: existingUser.fname,
            lname: existingUser.lname,
            email: existingUser.email,
            number: existingUser.number,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          email: user.email,
          fname: user.fname,
          lname: token.lname,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          email: token.email,
          fname: token.fname,
          lname: token.lname,
        },
      };
    },
  },
};
