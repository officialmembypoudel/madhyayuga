import { getCookie } from "cookies-next";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = new NextResponse();

  const checkUser = async () => {
    try {
      const token = getCookie("token", { req });
      const response = await fetch("http://localhost:4000/api/v1/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data?.user?.isAdmin ?? false; // Return whether the user is authenticated or not
    } catch (error) {
      console.log(error.message);
      return false; // Return false if there's an error
    }
  };

  const isAuthenticated = await checkUser();

  if (!isAuthenticated && !req.nextUrl.pathname.startsWith("/auth")) {
    return Response.redirect(new URL("/auth", req.url));
  }

  if (isAuthenticated && req.nextUrl.pathname.startsWith("/auth")) {
    return Response.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
