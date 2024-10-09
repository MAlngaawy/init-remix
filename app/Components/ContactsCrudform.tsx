import { Form, useNavigate } from '@remix-run/react';
import { ContactType } from '~/types/mainTypes';

type Props = {
  defaultValue?: ContactType;
};

const ContactsCrudform = ({ defaultValue }: Props) => {
  const navigate = useNavigate();

  return (
    <Form key={defaultValue?.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={defaultValue?.first}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          defaultValue={defaultValue?.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={defaultValue?.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={defaultValue?.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={defaultValue?.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
};

export default ContactsCrudform;
