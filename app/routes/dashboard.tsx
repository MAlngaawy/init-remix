import { Link, Outlet } from '@remix-run/react';

//* Error Boundary
export function ErrorBoundary() {
  return <div className="error-div">this is error here</div>;
}

const Dashboard = () => {
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <nav className="flex gap-4">
          <Link to={'static'}>Static</Link>
          {' - '}
          <Link to={'products'}>Products</Link>
        </nav>
        <main>
          <Outlet /> {/* Renders nested routes here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
