import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients, createClient, updateClient, deleteClient, searchClients } from "../redux/slices/clientSlice";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import Loader from "../components/Loader";

const Client = () => {
    const dispatch = useDispatch();
    const { clients, loading } = useSelector((state) => state.client);

    // State
    const [showModal, setShowModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientData, setClientData] = useState({
        name: "",
        address: "",
        businessName: "",
        businessAddress: "",
        mobileNumber: "",
        landlordName: "",
        landlordMobileNumber: ""
    });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    // Handle create/update
    const handleSave = (e) => {
        e.preventDefault()
        dispatch(createClient(clientData)).then(() => {
            setShowModal(false);
            dispatch(fetchClients());
        });
        setClientData({
            name: "",
            address: "",
            businessName: "",
            businessAddress: "",
            mobileNumber: "",
            landlordName: "",
            landlordMobileNumber: ""
        })
    };

    // Handle delete
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            dispatch(deleteClient(id)).then(() => dispatch(fetchClients()));
        }
    };

    // Handle search
    const handleSearch = () => {
        dispatch(searchClients({ name: searchTerm }));
    };

    return (
        <div className="p-4">
            {loading && <Loader />} {/* Loader */}
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Clients</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => { setShowModal(true); setClientData({ name: "", address: "", businessName: "", businessAddress: "", mobileNumber: "", landlordName: "", landlordMobileNumber: "" }); }}>
                    Add Client
                </button>
            </div>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border w-full"
                />
                <button className="ml-2 px-4 py-2 bg-gray-600 text-white" onClick={handleSearch}>
                    <FaSearch />
                </button>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border w-1/6 text-left">Client Number</th>
                        <th className="p-2 border text-left">Name</th>
                        <th className="p-2 border text-left">Business</th>
                        <th className="p-2 border text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client._id}>
                            <td className="p-2 border">{client.clientNumber}</td>
                            <td className="p-2 border">{client.name}</td>
                            <td className="p-2 border">{client.businessName}</td>
                            <td className="p-2 border">
                                <button className="text-blue-600" onClick={() => { }}>
                                    <FaEdit />
                                </button>
                                <button className="text-red-600 ml-2" onClick={() => handleDelete(client._id)}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-bold mb-4">Add Client</h2>
                        <form onSubmit={handleSave}>
                            {Object.keys(clientData).map((key) => (
                                <input
                                    required
                                    key={key}
                                    type="text"
                                    placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                                    value={clientData[key]}
                                    onChange={(e) => setClientData({ ...clientData, [key]: e.target.value })}
                                    className="w-full p-2 border mb-2"
                                />
                            ))}
                            <div className="flex justify-end gap-2">
                                <button className="px-4 py-2 bg-gray-400 text-white" onClick={() => {
                                    setShowModal(false)
                                    setClientData({
                                        name: "",
                                        address: "",
                                        businessName: "",
                                        businessAddress: "",
                                        mobileNumber: "",
                                        landlordName: "",
                                        landlordMobileNumber: ""
                                    })
                                }}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white" >Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Client;
