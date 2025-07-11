import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  // Check if the user is logged in by checking the presence of a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');  // You can also use cookies if preferred

    if (token) {
      // If logged in, redirect to the dashboard
      router.push('/dashboard');
    } else {
      // If not logged in, redirect to the login page
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Home;
