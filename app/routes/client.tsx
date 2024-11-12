import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Product } from '~/types/mainTypes';

export const loader = async () => {
  const data = await fetch('https://fakestoreapi.com/products/1')
    .then((res) => res.json())
    .then((json) => json);

  return { data };
};

const Client = () => {
  const [clientData, setClientData] = useState<Product | null>(null);
  const data = useLoaderData<typeof loader>();

  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch('https://fakestoreapi.com/products/1')
      .then((res) => res.json())
      .then((json) => {
        setClientData(json);
      });
  }, []);

  return (
    <div>
      <h1>This is a client component</h1>
      <button className="" onClick={() => setCount(count + 1)}>
        Count {count}
      </button>
      <h2>This is From loader</h2>
      <h3>{data.data.description}</h3>
      {'-----------------------------------------------------------'}
      <h2>This is From Client useEffect</h2>
      <h3>{clientData?.description}</h3>
    </div>
  );
};

export default Client;
