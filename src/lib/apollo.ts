import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-tanstack-start';
import { SetContextLink } from '@apollo/client/link/context';

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API_URL || '',
    credentials: 'include',
    headers: {
        'ngrok-skip-browser-warning': 'true',
    },
});

const authLink = new SetContextLink(({ headers }, _) => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            ...headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Product: {
                fields: {
                    media: {
                        merge(_, incoming) {
                            return incoming;
                        },
                    },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
            nextFetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
        },
    },
});

// src/lib/apollo.ts
// import { ApolloClient, InMemoryCache, HttpLink, from, Observable } from '@apollo/client';
// import { onError } from '@apollo/client/link/error';
// import { tryRefresh } from './auth';

// const httpLink = new HttpLink({
//     uri: import.meta.env.VITE_GRAPHQL_API_URL || '',
//     credentials: 'include',
// });

// const errorLink = onError(({ graphQLErrors, operation, forward }: any) => {
//     if (graphQLErrors) {
//         for (let err of graphQLErrors) {
//             if (err.message === 'jwt expired' || err.extensions?.code === 'UNAUTHENTICATED') {
//                 // Call Shawn's refresh logic!
//                 return new Observable((observer) => {
//                     tryRefresh().then((success) => {
//                         if (success) {
//                             const subscriber = forward(operation).subscribe(observer);
//                             return () => subscriber.unsubscribe();
//                         } else {
//                             window.location.href = '/login';
//                             observer.complete();
//                         }
//                     });
//                 });
//             }
//         }
//     }
// });

// export const apolloClient = new ApolloClient({
//     link: from([errorLink, httpLink]),
//     cache: new InMemoryCache(),
// });
