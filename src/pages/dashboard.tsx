import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Profile from '@/components/Profile';
import Tasks from '@/components/Tasks';
import Users from '@/components/Users';
import TaskAssignment from '@/components/TaskAssignment';


const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
        else {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
            if (decodedToken?.user?.role === 'admin') {
                setIsAdmin(true); // Set isAdmin to true if user is admin
            } else {
                router.push('/dashboard'); // If not an admin, redirect to user dashboard or homepage
            }
        }
    }, [router]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <ul className="mt-6 space-y-4">
                    <li>
                        <button onClick={() => setActiveTab('profile')} className="text-white hover:text-indigo-300">
                            Profile
                        </button>
                    </li>

                    <li>
                        <button onClick={() => setActiveTab('tasks')} className="text-white hover:text-indigo-300">
                            Tasks
                        </button>
                    </li>


                    {isAdmin && <>
                        <li>
                            <button
                                onClick={() => handleTabChange('users')}
                                className="text-white hover:text-indigo-300"
                            >
                                Users
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleTabChange('Task Mang')}
                                className="text-white hover:text-indigo-300"
                            >
                                Tasks Mang
                            </button>
                        </li>
                    </>}
                </ul>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/login');
                    }}
                    className="mt-6 w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                >
                    Logout
                </button>
            </div>

            {/* Right content box */}
            <div className="flex-1 p-6">
                {activeTab === 'profile' && <Profile />}
                {activeTab === 'tasks' && <Tasks />}
                {activeTab === 'users' && isAdmin && <Users />}
                {activeTab === 'Task Mang' && isAdmin && <TaskAssignment />}
            </div>
        </div>
    );
};

export default Dashboard;
