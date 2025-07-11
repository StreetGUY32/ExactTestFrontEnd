import { useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import Link from 'next/link';

const registerUser = async (credentials: { email: string; password: string; name: string; role: string }) => {
    const { data } = await axios.post('/api/auth/register', credentials);
    return data;
};

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const router = useRouter();

    const mutation = useMutation(registerUser, {
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ email, password, name, role });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {mutation.isLoading ? 'Registering...' : 'Register'}
                    </button>
                    <Link href={'/login'} className='text-indigo-400 text-center w-100 items-center gap-1 justify-center flex mt-4'>
                        Already have an account, <strong>Login</strong>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Register;
