import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  ErrorBoundaryComponent,
  LoaderFunction,
} from 'remix';
import { authenticator } from '~/auth.server';
import { AppProvider } from '~/app.context';
import semanticUrl from 'semantic-ui-css/semantic.min.css';
import globalStylesUrl from '~/styles/global.css';

export let loader: LoaderFunction = async ({ request }) => {
  const path = require('path');
  const fs = require('fs');
  const plist = require('plist');

  const ios_Info = plist.parse(
    fs.readFileSync(
      path.join(__dirname, '/../../ios/iResucito/Info.plist'),
      'utf8'
    )
  );

  const androidGradle = fs.readFileSync(
    path.join(__dirname, '/../../android/app/build.gradle'),
    'utf8'
  );

  const android_major = /def VERSION_MAJOR=(.*)/.exec(androidGradle)[1];
  const android_minor = /def VERSION_MINOR=(.*)/.exec(androidGradle)[1];
  const android_patch = /def VERSION_PATCH=(.*)/.exec(androidGradle)[1];
  const android_build = /def VERSION_BUILD=(.*)/.exec(androidGradle)[1];

  return {
    API_PORT: JSON.stringify(process.env ? process.env.API_PORT : ''),
    IOS_VERSION: JSON.stringify(
      `${ios_Info.CFBundleShortVersionString}.${ios_Info.CFBundleVersion}`
    ),
    ANDROID_VERSION: JSON.stringify(
      `${android_major}.${android_minor}.${android_patch}.${android_build}`
    ),
    authData: await authenticator.isAuthenticated(request),
  };
};

export let links = () => {
  return [
    { rel: 'stylesheet', href: globalStylesUrl },
    { rel: 'stylesheet', href: semanticUrl },
  ];
};

export default function App() {
  const data = useLoaderData();
  return (
    <AppProvider user={data.authData?.user}>
      <Document>
        <Outlet />
      </Document>
    </AppProvider>
  );
}

function Document({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>iResucito</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export let ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <ErrorDocument title="Error!">
      <div>
        <h1>There was an error</h1>
        <p>{error.message}</p>
        <hr />
        <p>
          Hey, developer, you should replace this with what you want your users
          to see.
        </p>
      </div>
    </ErrorDocument>
  );
};

export let CatchBoundary = () => {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <ErrorDocument title={`${caught.status} ${caught.statusText}`}>
      <h1>
        {caught.status}: {caught.statusText}
      </h1>
      {message}
    </ErrorDocument>
  );
};

function ErrorDocument({ children, title }: { children: any; title: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
