import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientsO, createClient, updateClient, deleteClient, searchClients, toggleClientStatus } from "../redux/slices/clientSlice";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaArrowRight, FaArrowLeft, FaToggleOn, FaToggleOff, FaTimes } from "react-icons/fa";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";

const Client = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { clients, loading, currentPageO, totalPagesO } = useSelector((state) => state.client);

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
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        dispatch(fetchClientsO({ page: currentPageO, limit: 50 }));
    }, [dispatch]);

    // Handle create/update
    const handleSave = (e) => {
        e.preventDefault()
        dispatch(createClient(clientData)).then(() => {
            setShowModal(false);
            dispatch(fetchClientsO({ page: currentPageO, limit: 50 }));
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

    const handleEdit = (e) => {
        e.preventDefault()
        dispatch(updateClient({ id: selectedClient._id, updatedData: selectedClient })).then(() => {
            setShowEditModal(false);
            setSelectedClient(null)
            dispatch(fetchClientsO({ page: currentPageO, limit: 50 }));
            searchResultUpdate()
        });
    };

    // Handle delete
    const handleDelete = (e,id) => {
        e.stopPropagation()
        if (window.confirm("Are you sure you want to delete this client?")) {
            dispatch(deleteClient(id)).then(() => {
                dispatch(fetchClientsO({ page: currentPageO, limit: 50 }))
                searchResultUpdate()
            });
        }
    };

    const searchResultUpdate = () => {
        if (showSearchModal) {
            dispatch(searchClients(searchTerm)).then(result => {
                if (Array.isArray(result.payload)) {
                    setSearchResults(result.payload);
                }
            })
        }
    }

    // Handle search
    const handleSearch = async () => {
        const result = await dispatch(searchClients(searchTerm));
        if (Array.isArray(result.payload)) {
            setSearchResults(result.payload);
            setShowSearchModal(true); // Open search modal
        }
    };

    // Pagination Functions
    const handlePrevPage = () => {
        if (currentPageO > 1) {
            dispatch(fetchClientsO({ page: currentPageO - 1, limit: 50 }));
        }
    };

    const handleNextPage = () => {
        if (currentPageO < totalPagesO) {
            dispatch(fetchClientsO({ page: currentPageO + 1, limit: 50 }));
        }
    };

    const handleToggleStatus = (e,clientId, currentStatus) => {
        e.stopPropagation()
        if (window.confirm("Are you sure?")) {
            const newStatus = currentStatus === 1 ? 0 : 1; // Toggle 1 ↔ 0
            dispatch(toggleClientStatus({ clientId, status: newStatus })).then(() => {
                dispatch(fetchClientsO({ page: currentPageO, limit: 50 }))
                searchResultUpdate()
            });
        }
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
            <table className="w-full  border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border w-1/6 text-left">Client Number</th>
                        <th className="p-2 border text-left">Name</th>
                        <th className="p-2 border text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.length > 0 && clients.map((client) => {
                        return <tr className="hover:bg-blue-100 cursor-pointer" onClick={()=>navigate(`/dashboard/client?clientID=${client._id}`)} key={client?._id}>
                            <td className="p-2 border">{client?.clientNumber}</td>
                            <td className="p-2 border "><div className="w-32 md:w-full overflow-hidden" >{client?.name}</div></td>
                            <td className="p-2 border flex flex-row items-center">
                                <button className="mx-4 text-blue-600" onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedClient(client)
                                    setShowEditModal(true)
                                }}>
                                    <FaEdit />
                                </button>
                                <button className="text-red-600 mr-4" onClick={(e) => handleDelete(e,client._id)}>
                                    <FaTrash />
                                </button>
                                <button className={`${client.status === 0 ? "text-red-600" : "text-green-600"}`} onClick={(e) => handleToggleStatus(e,client._id, client.status)}>
                                    {client.status === 1 ? <FaToggleOn size={30} /> : <FaToggleOff size={30} />}
                                </button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className={`px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 ${currentPageO === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handlePrevPage}
                    disabled={currentPageO === 1}
                >
                    <FaArrowLeft /> Prev
                </button>
                <span className="text-lg font-semibold">
                    Page {currentPageO} of {totalPagesO}
                </span>
                <button
                    className={`px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 ${currentPageO === totalPagesO ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleNextPage}
                    disabled={currentPageO === totalPagesO}
                >
                    Next <FaArrowRight />
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white md:w-1/2 w-11/12 p-6 rounded-lg">
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

            {showEditModal && (
                <div className="fixed z-10 inset-0 bg-gray-800 bg-opacity-50  flex items-center justify-center">
                    <div className="bg-white p-6 md:w-1/2 w-11/12 rounded-lg">
                        <h2 className="text-lg font-bold mb-4">Edit Client</h2>
                        <form onSubmit={handleEdit}>
                            {Object.keys(clientData).map((key) => (
                                <input
                                    key={key}
                                    type="text"
                                    placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                                    value={selectedClient[key]}
                                    onChange={(e) => setSelectedClient({ ...selectedClient, [key]: e.target.value })}
                                    className="w-full p-2 border mb-2"
                                />
                            ))}
                            <div className="flex justify-end gap-2">
                                <button className="px-4 py-2 bg-gray-400 text-white" onClick={() => {
                                    setShowEditModal(false)
                                    setSelectedClient(null)
                                }}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white" >Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search Modal */}
            {showSearchModal && (
                <div className="fixed  inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white h-1/2 flex flex-row overflow-scroll  rounded-lg w-11/12 md:w-1/3 ">
                        <div className="flex fex-col w-11/12 justify-between p-2 md:w-1/3 bg-gray-200 fixed items-center">
                            <h2 className="text-lg font-bold">Search Results</h2>
                            <button className="text-red-600 mr-2" onClick={() => setShowSearchModal(false)}>
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <ul className="mt-10 w-11/12">
                            {searchResults.length > 0 ? (
                                searchResults.map((client) => {
                                    if (client.status === 0) {
                                        return <span key={client._id} className="border-b p-2 flex flex-row justify-between">
                                            <li className="">
                                                {client.clientNumber}
                                            </li>
                                            <li className="mx-4">
                                                <div className="w-40 md:w-full overflow-hidden" >{client.name}</div>
                                            </li>
                                            <li className=" flex flex-row items-center">
                                                <button className="mx-4 text-blue-600" onClick={() => {
                                                    setSelectedClient(client)
                                                    setShowEditModal(true)
                                                }}>
                                                    <FaEdit />
                                                </button>
                                                <button className="text-red-600 mr-4" onClick={() => handleDelete(client._id)}>
                                                    <FaTrash />
                                                </button>
                                                <button className={`${client.status === 0 ? "text-red-600" : "text-green-600"}`} onClick={() => handleToggleStatus(client._id, client.status)}>
                                                    {client.status === 1 ? <FaToggleOn size={30} /> : <FaToggleOff size={30} />}
                                                </button>
                                            </li>
                                        </span>
                                    }
                                })
                            ) : (
                            <p className="text-red-600">No clients found</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Client;
