import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser, editUser, registerUser } from "../redux/slices/authSlice";
import Loader from "../components/Loader";
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";

const Admin = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.auth);
    const isLoading = useSelector((state) => state.auth.loader);

    // States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userData, setUserData] = useState({ username: "", password: "" });
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Fetch Users on Load
    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    // Handle Delete User
    const handleDelete = (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            dispatch(deleteUser(userId)).then(() => dispatch(getAllUsers()));
        }
    };

    // Handle Edit User
    const handleEdit = () => {
        dispatch(editUser({ userId: selectedUser._id, userData })).then(() => {
            setShowEditModal(false);
            dispatch(getAllUsers());
            setUserData({ username: "", password: "" }); // Clear userData after saving
        });
    };

    // Handle Create User
    const handleCreate = () => {
        dispatch(registerUser(userData)).then(() => {
            setShowCreateModal(false);
            dispatch(getAllUsers());
            setUserData({ username: "", password: "" }); // Clear userData after saving
        });
    };

    // Clear userData when Cancel is clicked
    const handleCancel = () => {
        setShowEditModal(false);
        setShowCreateModal(false);
        setUserData({ username: "", password: "" }); // Clear userData
    };

    return (
        <div className="p-4 md:p-8">
            {isLoading && <Loader />} {/* Loader Component */}

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">User Dashboard</h1>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setShowCreateModal(true)}
                >
                    <FaPlus /> Create User
                </button>
            </div>

            {/* User List */}
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 border">Username</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="">
                                    <td className="p-2 border">{user.name}</td>
                                    <td className="p-2 border flex justify-center gap-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setUserData({ username: user.name });
                                                setShowEditModal(true);
                                            }}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Edit User</h2>
                        <input
                            required
                            type="text"
                            placeholder="Username"
                            value={userData.username}
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                            className="w-full p-2 border mb-2"
                        />
                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={handleCancel}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleEdit}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Create User</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={userData.username}
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                            className="w-full p-2 border mb-2"
                            required
                        />
                        <div className="relative mb-2">
                            <input
                                required
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Password"
                                value={userData.password}
                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                className="w-full p-2 border"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={handleCancel}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCreate}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
