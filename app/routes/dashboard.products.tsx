import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { Product } from '~/types/mainTypes';

export const loader = async () => {
  const productsData = await fetch('https://fakestoreapi.com/products')
    .then((res) => res.json())
    .then((json) => json);

  return { productsData };
};

//? This is error boundary for this nested rote
export function ErrorBoundary() {
  return (
    <div className="p-10 bg-red-400 text-4xl font-bold text-white m-10 text-center flex items-center justify-center">
      <p>This is an error with this product</p>
    </div>
  );
}

function Products() {
  const { productsData } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="flex gap-10">
        <div>
          {productsData?.map((onePro: Product) => {
            return (
              <div key={onePro.id}>
                <Link
                  className="text-xs text-blue-500 my-4"
                  to={onePro.id.toString()}
                >
                  {onePro.title}
                </Link>
              </div>
            );
          })}
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Products;
