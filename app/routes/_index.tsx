// import { PrismaClient } from '@prisma/client';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/db.server';

// const prisma = new PrismaClient();

export const loader = async () => {
  const posts = await db.post.findMany();
  const users = await db.user.findMany();

  return json({ posts, users });
};

export default function Index() {
  const { users, posts } = useLoaderData<typeof loader>();
  console.log('USERS', users);
  console.log('POSTS', posts);

  return (
    <p id="index-page">
      This is a demo for Remix.
      <br />
      Check out <a href="https://remix.run">the docs at remix.run</a>.
    </p>
  );
}
