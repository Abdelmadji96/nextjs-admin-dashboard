import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "hirini-secret-key-2025";

/**
 * Decrypt data from cookies (server-side)
 */
const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return null;
  }
};

/**
 * Get decrypted access token from cookies (server-side)
 */
const getAccessToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const encryptedToken = cookieStore.get("access_token");
    if (!encryptedToken?.value) return null;
    return decryptData(encryptedToken.value);
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
};

/**
 * Get decrypted user data from cookies (server-side)
 */
const getUser = async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const encryptedUser = cookieStore.get("user");
    if (!encryptedUser?.value) return null;
    return decryptData(encryptedUser.value);
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

/**
 * Middleware to protect dashboard routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication data
  const accessToken = await getAccessToken();
  const user = await getUser();

  // Check if user is authenticated
  const isAuthenticated = !!(accessToken && user);

  // Define protected routes (dashboard routes)
  const isProtectedRoute = pathname.startsWith("/") && 
    !pathname.startsWith("/login") && 
    !pathname.startsWith("/signup") && 
    !pathname.startsWith("/forgot-password") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/images") &&
    !pathname.startsWith("/favicon.ico");

  // Define auth routes (login, signup, etc.)
  const isAuthRoute = pathname.startsWith("/login") || 
    pathname.startsWith("/signup") || 
    pathname.startsWith("/forgot-password");

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users trying to access auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

/**
 * Configure middleware to run on specific paths
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\..*|api).*)",
  ],
};

