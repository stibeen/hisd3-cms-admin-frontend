// src/lib/auth.ts
import { GraphQLClient, ClientError, gql } from "graphql-request";
import { ME_QUERY } from "@/graphql/queries";

// Use your existing VITE_GRAPHQL_API_URL
const API_URL = `${import.meta.env.VITE_GRAPHQL_API_URL}` || "";
export const baseClient = new GraphQLClient(API_URL, {
  credentials: "include", // This is crucial for sending cookies
  headers: {
    'ngrok-skip-browser-warning': 'true',
    get Authorization() {
      const token = localStorage.getItem('accessToken');
      return token ? `Bearer ${token}` : "";
    }
  },
});

const REFRESH_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      user { id }
    }
  }
`;

// const ME_QUERY = gql`
//   query MeQuery {
//     meQuery {
//       isSignedIn
//       user {
//         id
//         username
//       }
//     }
//   }
// `;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

function isAuthError(error: any): boolean {
  if (!(error instanceof ClientError)) return false;
  const messages = error.response.errors?.map((e) => e.message) ?? [];
  return messages.some(
    (msg) =>
      msg.includes("Unauthorized") ||
      msg.includes("UNAUTHENTICATED") ||
      msg.includes("jwt expired") ||
      msg.includes("Token") ||
      msg.includes("token")
  );
}

export async function tryRefresh(): Promise<boolean> {
  if (isRefreshing) {
    return refreshPromise || Promise.resolve(false);
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      await baseClient.request(REFRESH_MUTATION);
      return true;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function fetchMe() {
  try {
    const data: any = await baseClient.request(ME_QUERY);
    return data.meQuery;
  } catch (error) {
    if (isAuthError(error)) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        try {
          const retryData: any = await baseClient.request(ME_QUERY);
          return retryData.meQuery;
        } catch {
          return { isSignedIn: false };
        }
      }
    }
    return { isSignedIn: false };
  }
}
