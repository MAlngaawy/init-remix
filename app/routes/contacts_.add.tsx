import { ActionFunctionArgs, redirect } from '@remix-run/node';
import ContactsCrudform from '~/Components/ContactsCrudform';
import { db } from '~/db.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const contact = await db.influncer.create({
    data,
  });

  return redirect(`/contacts/${contact.id}`);
};

const AddContacts = () => {
  return (
    <div>
      <ContactsCrudform />
    </div>
  );
};

export default AddContacts;
