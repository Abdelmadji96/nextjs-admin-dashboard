# Token Refresh Strategy - Simplified Interceptor-Only Approach

## Overview

This application uses a **single, clean approach** for token management - everything is handled in the Axios interceptor (`src/lib/api.ts`). No additional hooks, managers, or services needed.

---

## How It Works

### 1. **Cookie Storage (7 days + 30 days)**
- **Access Token**: Stored encrypted in cookies, expires in **7 days**
- **Refresh Token**: Stored encrypted in cookies, expires in **30 days**
- Both are automatically encrypted/decrypted using `crypto-js`

### 2. **Automatic Token Refresh**
When any API request returns a **401 Unauthorized**:

1. ✅ **Interceptor catches the error**
2. ✅ **Checks if refresh token exists** in cookies
3. ✅ **Calls `/auth/refresh` endpoint** directly
4. ✅ **Updates access token** in cookies with extended 7-day expiration
5. ✅ **Retries the original request** with new token
6. ✅ **All queued requests** are automatically retried with the new token

### 3. **Request Queue Management**
If multiple requests fail simultaneously:
- Only **ONE** refresh request is made
- All other requests are **queued**
- When refresh succeeds, all queued requests **retry automatically**
- If refresh fails, all queued requests are **rejected** and user is redirected to login

---

## Code Flow

### Request Interceptor (src/lib/api.ts)
```typescript
// Adds Bearer token to every request
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken(); // Decrypts from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor (src/lib/api.ts)
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. Check if 401 error
    if (error.response?.status === 401) {
      
      // 2. Get refresh token from cookies
      const refresh_token = getRefreshToken();
      
      if (!refresh_token) {
        // No refresh token → Redirect to login
        clearAuthData();
        window.location.replace("/login");
        return;
      }
      
      // 3. If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          // Retry with new token when ready
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      
      // 4. Call refresh endpoint
      isRefreshing = true;
      
      try {
        const response = await axios.post('/auth/refresh', { refresh_token });
        const { access_token } = response.data;
        
        // 5. Update token in cookies (extends to 7 days again)
        updateAccessToken(access_token);
        
        // 6. Resolve all queued requests
        processQueue(null, access_token);
        
        // 7. Retry original request
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed → Clear auth and redirect
        processQueue(refreshError, null);
        clearAuthData();
        window.location.replace("/login");
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## Key Features

### ✅ **Automatic & Transparent**
- User never sees token expiration
- Requests automatically retry after refresh
- No manual intervention needed

### ✅ **Prevents Infinite Loops**
- `_retry` flag prevents re-attempting same request
- `isLoggingOut` flag prevents refresh during logout
- Refresh endpoint itself is never retried

### ✅ **Handles Concurrent Requests**
- Only one refresh call for multiple failed requests
- Queue system ensures all requests eventually succeed or fail together

### ✅ **Cookie Expiration Management**
- Every token refresh **extends** the cookie expiration to 7 days
- User stays logged in as long as they use the app within 7 days
- Refresh token lasts 30 days without activity

### ✅ **Secure Storage**
- All tokens encrypted with AES before storing in cookies
- `secure: true` - Only sent over HTTPS
- `sameSite: 'strict'` - Prevents CSRF attacks

---

## Login Flow

```typescript
// src/services/auth.service.ts
export const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  
  // Save tokens to encrypted cookies (7 days + 30 days)
  saveAuthData(response.data);
  
  return response.data;
};
```

**What happens:**
1. User submits login credentials
2. Server returns `access_token` + `refresh_token`
3. Both tokens are **encrypted** and saved to cookies
4. User can now make API requests for 7 days
5. After 7 days, token auto-refreshes (if refresh token still valid)

---

## Logout Flow

```typescript
// src/services/auth.service.ts
export const logout = () => {
  setLoggingOut(true);           // Prevent refresh attempts
  queryClient.cancelQueries();   // Cancel ongoing requests
  queryClient.clear();           // Clear cache
  clearAuthData();               // Delete cookies
  window.location.href = "/login"; // Redirect
};
```

**What happens:**
1. User clicks logout
2. Flag prevents interceptor from trying to refresh
3. All pending API requests are cancelled
4. All cookies are deleted
5. User is redirected to login page

---

## Why This Approach is Better

### ❌ **Old Approach (Complex)**
- Multiple token managers
- Separate hooks (`useTokenRefresh`)
- Timer-based proactive refresh
- Activity tracking listeners
- Multiple places handling refresh logic
- Difficult to debug

### ✅ **New Approach (Simple)**
- **ONE place** handles everything (interceptor)
- **No hooks** or timers needed
- **Reactive** - only refreshes when needed
- **Easy to debug** - all logs in one place
- **Works automatically** - just use `apiClient`

---

## Usage in Components

Just use `useFetch` or `usePost` as normal - token refresh is **automatic**:

```typescript
// No special setup needed!
const { data, isLoading, error } = useFetch(
  ["candidates"],
  getCandidates
);

// Token refresh happens automatically if needed
// Component doesn't need to know anything about it
```

---

## Console Logs for Debugging

The interceptor provides clear logs:

```
[API] Token expired, refreshing...
[API] ✅ Token refreshed successfully
[Cookies] Access token and user data updated, expires in 7 days
```

Or if refresh fails:

```
[API] ❌ Token refresh failed: Refresh token expired
[API] Redirecting to login...
```

---

## Files Involved

### Core Files
- `src/lib/api.ts` - **Main interceptor** (handles everything)
- `src/lib/cookies.ts` - Encryption/decryption helpers
- `src/services/auth.service.ts` - Login/logout functions
- `src/middleware.ts` - **Server-side route protection**

### Removed Files (No longer needed)
- ~~`src/lib/tokenRefreshManager.ts`~~ ❌ Deleted
- ~~`src/hooks/useTokenRefresh.ts`~~ ❌ Deleted
- ~~`src/components/Auth/auth-guard.tsx`~~ ❌ Deleted (middleware handles it)
- ~~`src/components/Auth/index.ts`~~ ❌ Deleted

---

## Security Features

1. **AES Encryption** - Tokens encrypted in cookies
2. **Secure Cookies** - Only sent over HTTPS
3. **SameSite Strict** - Prevents CSRF attacks
4. **Auto Expiration** - Tokens expire even if stolen
5. **Logout Prevention** - No refresh during logout
6. **Single Refresh** - Prevents refresh token abuse
7. **Server-Side Protection** - Middleware validates authentication on every request
8. **No Client-Side Guards** - Prevents loading spinners and improves UX

---

## Summary

✅ **One interceptor does everything**  
✅ **No manual refresh needed**  
✅ **Tokens stay fresh automatically**  
✅ **User stays logged in for 7+ days with activity**  
✅ **Secure encrypted storage**  
✅ **Easy to understand and maintain**  

The token is automatically refreshed whenever needed, and the cookie expiration is extended every time. The user never has to login again unless they're inactive for 30 days (refresh token expiration) or manually logout.

