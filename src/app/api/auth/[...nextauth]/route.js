import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
//import db from '@/libs/db';
import bcryptjs from 'bcryptjs';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                    select: {
                        id: true,
                        email:true,
                        role: true,
                        username: true,
                        phone: true,
                        password: true
                    }
                });
                
                if (!userFound) throw new Error("User not found");

                const matchPassword = await bcryptjs.compare(credentials.password, userFound.password);
                if (!matchPassword) { throw new Error("Wrong Password"); }

                return userFound;
                    
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
                token.phone = user.phone;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.username = token.username;
            session.user.phone = token.phone;
            return session;
        }
    },
    pages: {
        signIn: '/auth/login'
    },
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
