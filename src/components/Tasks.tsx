import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import ReactToast from 'react-hot-toast';
import io from 'socket.io-client';

// Connect to Socket.io server
const socket = io('http://localhost:5000'); // Change this if needed for production

// Fetch tasks
const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/tasks/getAll', {
        headers: { 'x-auth-token': token },
    });
    return data;
};

// Create task
const createTask = async (task: { title: string; description: string }) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.post('/api/tasks/create', task, {
        headers: { 'x-auth-token': token },
    });
    return data;
};

// Delete task
const deleteTask = async (taskId: string) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.delete(`/api/tasks/delete/${taskId}`, {
        headers: { 'x-auth-token': token },
    });
    return data;
};

// Update task
const updateTask = async (params: { taskId: string; title: string; description: string }) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.put(
        `/api/tasks/update/${params.taskId}`,
        { title: params.title, description: params.description },
        {
            headers: { 'x-auth-token': token },
        }
    );
    return data;
};

const Tasks = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const { data: tasks, refetch } = useQuery('tasks', fetchTasks);

    const createTaskMutation = useMutation(createTask, {
        onSuccess: () => {
            ReactToast.success('Task created successfully');
            refetch(); // Refresh task list
        },
        onError: () => {
            ReactToast.error('Failed to create task');
        },
    });

    const updateTaskMutation = useMutation(updateTask, {
        onSuccess: () => {
            ReactToast.success('Task updated successfully');
            refetch(); // Refresh task list
            setIsEditing(false);
            setCurrentTaskId(null);
            setTitle('');
            setDescription('');
        },
        onError: () => {
            ReactToast.error('Failed to update task');
        },
    });

    const deleteTaskMutation = useMutation(deleteTask, {
        onSuccess: () => {
            ReactToast.success('Task deleted successfully');
            refetch(); // Refresh task list
        },
        onError: () => {
            ReactToast.error('Failed to delete task');
        },
    });

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        createTaskMutation.mutate({ title, description });
        setTitle('');
        setDescription('');
    };

    const handleUpdateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentTaskId) {
            updateTaskMutation.mutate({ taskId: currentTaskId, title, description });
        }
    };

    const handleDeleteTask = (taskId: string) => {
        deleteTaskMutation.mutate(taskId);
    };

    const handleEditClick = (taskId: string, taskTitle: string, taskDescription: string) => {
        setIsEditing(true);
        setCurrentTaskId(taskId);
        setTitle(taskTitle);
        setDescription(taskDescription);
    };

    // Listen for task assigned event
    useEffect(() => {
        if (!socket) return;

        socket.on('taskAssigned', (data) => {
            ReactToast.success(`Task Assigned: ${data.task.title} to ${data.user.name}`, {
                duration: 10000,
            });
        });

        return () => {
            socket.off('taskAssigned');
        };
    }, [socket]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            <form onSubmit={isEditing ? handleUpdateTask : handleCreateTask} className="mb-6">
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
                <button
                    type="submit"
                    className="py-2 px-4 bg-indigo-600 text-white rounded"
                >
                    {isEditing ? 'Update Task' : 'Create Task'}
                </button>
            </form>

            <div className="space-y-4">
                {tasks?.map((task: any) => (
                    <div key={task._id} className="bg-white p-6 rounded shadow">
                        <h3 className="font-bold">{task.title}</h3>
                        <p>{task.description}</p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleEditClick(task._id, task.title, task.description)}
                                className="py-2 px-4 bg-yellow-500 text-white rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="py-2 px-4 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
