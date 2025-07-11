import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import ReactToast from 'react-hot-toast';

// Fetch tasks for a specific user (Admin view)
const fetchTasksForUser = async (userId: string) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(`/api/tasks/getTasksForUser/${userId}`, {
        headers: { 'x-auth-token': token },
    });
    return data;
};

// Fetch users list
const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/users/getAllUsers', {
        headers: { 'x-auth-token': token },
    });
    return data;
};


const Users = () => {
    const { data: users, refetch } = useQuery('users', fetchUsers);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [viewingUser, setViewingUser] = useState<boolean>(false);
    const [userTasks, setUserTasks] = useState<any[]>([]);

    const handleViewUserProfile = async (userId: string, name: string, email: string) => {
        setViewingUser(true);
        setUserName(name);
        setUserEmail(email);
        setSelectedUserId(userId);

        // Fetch tasks for this user
        const tasks = await fetchTasksForUser(userId);
        setUserTasks(tasks); // Set tasks associated with the user
    };

    // Function to handle user deletion
    const handleDeleteUser = async (userId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/deleteProfile/${userId}`, {
                headers: { 'x-auth-token': token },
            });
            ReactToast.success('User deleted successfully');
            refetch(); // Refresh the users list
        } catch (error: any) {
            ReactToast.error(error?.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <div className="space-y-4">
                {users?.map((user: any) => (
                    <div key={user._id} className="bg-white p-6 rounded shadow flex justify-between">
                        <h3 className="font-bold">{user.name}</h3>
                        <div>
                            <button
                                onClick={() => handleViewUserProfile(user._id, user.name, user.email)}
                                className="py-2 px-4 bg-blue-500 text-white rounded"
                            >
                                View Profile
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="py-2 px-4 bg-red-600 text-white rounded ml-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {viewingUser && (
                <div className="mt-6 bg-white p-6 rounded shadow">
                    <h3 className="text-xl font-bold">User Profile</h3>
                    <p><strong>Name:</strong> {userName}</p>
                    <p><strong>Email:</strong> {userEmail}</p>

                    <h4 className="mt-4 font-bold">Tasks Assigned to {userName}</h4>
                    <div>
                        {userTasks.length === 0 ? (
                            <p>No tasks assigned to this user.</p>
                        ) : (
                            userTasks.map((task: any) => (
                                <div key={task._id} className="bg-gray-100 p-4 mb-2 rounded">
                                    <h5 className="font-bold">{task.title}</h5>
                                    <p>{task.description}</p>
                                    <p><strong>Status:</strong> {task.status}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
