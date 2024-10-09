//? Imports
import type { FunctionComponent } from 'react';
// import type { ContactRecord } from '../data';
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  MetaFunction,
} from '@remix-run/node';

import { json } from '@remix-run/node';
import {
  Form,
  useFetcher,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { getContact, updateContact } from '../data';
import invariant from 'tiny-invariant';
import { db } from '~/db.server';
import { ContactType } from '~/types/mainTypes';

//? Loader
export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing Contact Params');

  const realContact = await db.influncer.findFirst({
    where: {
      id: params.contactId,
    },
  });
  const fakeContacts = await getContact(params.contactId);

  if (!realContact && !fakeContacts) {
    throw new Response('Not Found', { status: 404 });
  }

  // throw new Response('Test', { status: 400 });

  return json({ realContact, fakeContacts });
};

//? Action
export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param');
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true',
  });
};

//? Error Boundary
export function ErrorBoundary() {
  console.log('first ErrorBoundary Runs');
  const error = useRouteError();
  console.error(error);
  return <div className="error-div">Can not find the contact </div>;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.realContact?.first + ' ' + data?.realContact?.last },
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

//? Component
export default function Contact() {
  const { fakeContacts, realContact } = useLoaderData<typeof loader>();

  console.log('fakeContacts', fakeContacts);
  console.log(', realContact', realContact);

  const contact = realContact || fakeContacts || ({} as ContactType);

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact?.first} ${contact?.last} avatar`}
          key={contact?.avatar}
          src={contact?.avatar || 'No Image'}
        />
      </div>

      <div>
        <h1>
          {contact?.first || contact?.last ? (
            <>
              {contact?.first} {contact?.last}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite contact={contact} />
        </h1>

        {contact?.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact?.twitter}`}>
              {contact?.twitter}
            </a>
          </p>
        ) : null}

        {contact?.notes ? <p>{contact?.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                'Please confirm you want to delete this record.'
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactType, 'favorite'>;
}> = ({ contact }) => {
  const fetcher = useFetcher();

  const favorite = fetcher.formData
    ? fetcher.formData.get('favorite') === 'true'
    : contact?.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name="favorite"
        value={favorite ? 'false' : 'true'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
};
