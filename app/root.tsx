//? import
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Meta,
  Form,
  Links,
  Outlet,
  Scripts,
  NavLink,
  useNavigation,
  useLoaderData,
  ScrollRestoration,
  useSubmit,
  useRouteError,
} from '@remix-run/react';
// import { getContacts } from './data';
import appStylesHref from './app.css?url';
import { useEffect, useState } from 'react';
import { db } from './db.server';

//? Exports
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: appStylesHref },
];

//? Meta tags
export const meta: MetaFunction = () => {
  return [
    { title: 'Very cool app | Remix' },
    {
      property: 'og:title',
      content: 'Very cool app',
    },
    {
      name: 'description',
      content: 'This app is the best',
    },
  ];
};

// //* Loader (GET)
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const contacts = await db.influncer.findMany({
    where: {
      OR: [
        {
          first: {
            contains: q,
            mode: 'insensitive', // Optional: to make it case-insensitive
          },
        },
        {
          last: {
            contains: q,
            mode: 'insensitive',
          },
        },
        // Add other fields you want to filter by
      ],
    },
  });

  // throw an error if something goes wrong during data fetching

  return json({ contacts, q });
};

//* Action (POST)
export const action = async () => {
  // const contact = await createEmptyContact();
  return redirect(`/contacts/add`);
};

//* Error Boundary
export function ErrorBoundary() {
  console.log('first ErrorBoundary Runs');
  const error = useRouteError();
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <div className="error-div">this is error here</div>
        <Scripts />
      </body>
    </html>
  );
}

//? Component
export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  //? This is the React.js way that More code
  const [query, setQuery] = useState(q || '');
  useEffect(() => {
    setQuery(q || '');
  }, [q]);

  //? This is the old way that required less code
  // useEffect(() => {
  //   const searchField = document.getElementById('q');
  //   if (searchField instanceof HTMLInputElement) {
  //     searchField.value = q || '';
  //   }
  // }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              id="search-form"
              role="search"
            >
              <input
                id="q"
                className={searching ? 'loading' : ''}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                onChange={(e) => {
                  setQuery(e.currentTarget.value);
                }}
                value={query}
                // defaultValue={q || ''} -> use this if U use other way
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <nav>
              {contacts.length ? (
                <ul>
                  {contacts.map((contact) => (
                    <li key={contact.id}>
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isActive ? 'active' : isPending ? 'pending' : ''
                        }
                        to={`contacts/${contact.id}`}
                      >
                        {contact.first || contact.last ? (
                          <>
                            {contact.first} {contact.last}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{' '}
                        {contact.favorite ? <span>★</span> : null}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  <i>No contacts</i>
                </p>
              )}
            </nav>
          </nav>
        </div>
        <div
          id="detail"
          className={
            navigation.state === 'loading' && !searching ? 'loading' : ''
          }
        >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
