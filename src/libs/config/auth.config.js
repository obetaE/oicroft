

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.isWorker = user.isWorker;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.isWorker = token.isWorker;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
    authorized({ auth, request }) {
      const user = auth?.user;
      const isOnAdminPanel = request.nextUrl?.pathname.startsWith("/admin");
      const isOnOrderPage = request.nextUrl?.pathname.startsWith("/order");
      const isOnCartPage = request.nextUrl?.pathname.startsWith("/cart");
      const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");

      // ONLY ADMIN CAN REACH THE ADMIN DASHBOARD
      if (isOnAdminPanel && !user?.isAdmin) {
        return false;
      }

      //ONLY AUTHENTICATED USERS CAN REACH THE ORDER AND CART PAGE

       if (isOnOrderPage && !user) {
         return false;
       }

      if (isOnCartPage && !user) {
        return false;
      }

      //ONLY VERIFIED USERS CAN REACH THE ORDER AND CART PAGE
if (isOnOrderPage && user?.isVerified) {
  return Response.redirect(new URL("/resendotp", request.nextUrl));
}

if (isOnCartPage && user?.isVerified) {
  return Response.redirect(new URL("/resendotp", request.nextUrl));
}


      //ONLY UNAUTHENTICATED CAN REACH THE LOGIN PAGE
      if (isOnLoginPage && user) {
        return Response.redirect(new URL("/", request.nextUrl))
      }

      return true;
    },
  },
};
