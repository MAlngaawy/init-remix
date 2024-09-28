//? import
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
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
} from '@remix-run/react';
import { createEmptyContact, getContacts } from './data';
import appStylesHref from './app.css?url';
import { useEffect, useState } from 'react';

//? Exports
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: appStylesHref },
];

//* GET
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return json({ contacts, q });
};
//* POST
export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

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
              onChange={(event) => submit(event.currentTarget)}
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
