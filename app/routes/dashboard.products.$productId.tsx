import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // productId:
  const onePro = await fetch(
    'https://fakestoreapi.com/products/' + params.productId
  )
    .then((res) => res.json())
    .then((json) => json);

  return { onePro };
};

//? This is error boundary for this nested rote
export function ErrorBoundary() {
  return (
    <div className="p-10 bg-red-400 text-4xl font-bold text-white m-10 text-center flex items-center justify-center">
      <p>This is an error with this product</p>
    </div>
  );
}

function SingleProduct() {
  const { onePro } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl font-bold">Single product</h1>
      <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden m-4">
        <img
          src={onePro.image}
          alt={onePro.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {onePro.title}
          </h2>
          <p className="text-gray-700 mt-2 text-lg font-bold">
            ${onePro.price.toFixed(2)}
          </p>
          <p className="text-gray-600 mt-4">{onePro.description}</p>
          <p className="text-gray-700 mt-4">
            <strong>Category:</strong> {onePro.category}
          </p>
          <div className="flex items-center mt-4">
            <span className="text-yellow-500 font-bold mr-1">
              {onePro.rating.rate}
            </span>
            <span className="text-gray-600">
              ({onePro.rating.count} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
