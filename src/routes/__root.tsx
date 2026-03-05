import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { ApolloClientIntegration } from "@apollo/client-integration-tanstack-start";
import appCss from '../styles.css?url'
import NotFound from '@/components/NotFound'
import { ErrorPage } from '@/components/ErrorPage'

export const Route = createRootRouteWithContext<ApolloClientIntegration.RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'HISD3 CMS',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      { rel: 'icon', href: '/favicon.svg' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: ErrorPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

