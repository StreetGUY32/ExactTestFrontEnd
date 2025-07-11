import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import ReactToast from 'react-hot-toast';

// Fetch users for dropdown
const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/users/getAllUsers', {
        headers: { 'x-auth-token': token },
    });
    return data;
};

// Create task with user assignment
const createTask = async (task: { title: string; description: string; assignedTo: string }) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.post('/api/tasks/create', task, {
        headers: { 'x-auth-token': token },
    });
    return data;
};

const TaskAssignment = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const { data: users, isLoading: usersLoading } = useQuery('users', fetchUsers);

    const createTaskMutation = useMutation(createTask, {
        onSuccess: () => {
            ReactToast.success('Task assigned successfully');
            setTitle('');
            setDescription('');
            setAssignedTo('');
        },
        onError: () => {
            ReactToast.error('Failed to assign task');
        },
    });

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        createTaskMutation.mutate({ title, description, assignedTo });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Assign Task to User</h2>
            <form onSubmit={handleCreateTask} className="mb-6">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Select User</option>
                        {users?.map((user: any) => (
                            <option key={user._id} value={user._id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="py-2 px-4 bg-indigo-600 text-white rounded"
                >
                    Assign Task
                </button>
            </form>
        </div>
    );
};

export default TaskAssignment;
