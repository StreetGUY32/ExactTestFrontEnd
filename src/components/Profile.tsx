import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import ReactToast from 'react-hot-toast';

// Define the fetchUserProfile function
const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('User not authenticated');
    }
    const { data } = await axios.get('/api/users/viewProfile', {
        headers: {
            'x-auth-token': token,  // Attach token in the request header for authentication
        },
    });
    return data;  // Return the fetched data
};

const updateUserProfile = async (updatedUser: { name: string; email: string }) => {
    const token = localStorage.getItem('token');
    const { data } = await axios.put('/api/users/updateProfile', updatedUser, {
        headers: { 'x-auth-token': token }, // Include token in headers for authentication
    });
    return data; // Return updated data
};

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const { data: userProfile, isLoading } = useQuery('userProfile', fetchUserProfile);

    const updateProfileMutation = useMutation(updateUserProfile, {
        onSuccess: () => {
            ReactToast.success('Profile updated successfully');
            setIsEditing(false); // Close edit mode
        },
        onError: () => {
            ReactToast.error('Failed to update profile');
        },
    });

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setEmail(userProfile.email);
        }
    }, [userProfile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent unnecessary submission if there are no changes
        if (name === userProfile?.name && email === userProfile?.email) {
            return;
        }

        updateProfileMutation.mutate({ name, email });
    };

    if (isLoading) return <div>Loading...</div>;

    // Check if there are any changes to the profile
    const isSaveDisabled = name === userProfile?.name && email === userProfile?.email;

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="flex justify-between">
                    {isEditing ? (
                        <button
                            type="submit"
                            className="py-2 px-4 bg-indigo-600 text-white rounded"
                            disabled={isSaveDisabled} // Disable save if no changes
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="py-2 px-4 bg-indigo-600 text-white rounded"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Profile;
