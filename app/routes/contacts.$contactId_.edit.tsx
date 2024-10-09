//? Imports
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';

import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

// import { updateContact } from '../data';
import { db } from '~/db.server';
import ContactsCrudform from '~/Components/ContactsCrudform';
import { ContactType } from '~/types/mainTypes';

//? Exports
export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param');
  // const contact = await getContact(params.contactId);
  const contact = await db.influncer.findFirst({
    where: {
      id: params.contactId,
    },
  });
  if (!contact) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ contact });
};

//? Action
export const action = async ({ params, request }: ActionFunctionArgs) => {
  //invariant will throw an Error if the condition is falsey
  invariant(params.contactId, 'Missing contactId param');

  //request is the plain form request and we extraxt the form data from it
  const formData = await request.formData();

  // Convert FormData to an object
  const updates = Object.fromEntries(formData);

  // await updateContact(params.contactId, updates);
  await db.influncer.update({
    where: {
      id: params.contactId,
    },
    data: updates,
  });
  return redirect(`/contacts/${params.contactId}`);
};

//? Component
export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  // const navigate = useNavigate();

  return <ContactsCrudform defaultValue={contact as ContactType} />;
}
