import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchDailyInterests,
    createDailyInterest,
    updateDailyInterest,
    deleteDailyInterest,
    // toggleDailyInterestStatus,
    getSchemesByClientId,
    getDailyInterestsByClientId,
} from '../redux/slices/dailyInterestSlice';

const DailyInterestComponent = ({ clientId }) => {
    const dispatch = useDispatch();
    const { dailyInterests, loading, error } = useSelector((state) => state.dailyInterest);

    const [formData, setFormData] = useState({
        amount: '',
        // receivedAmount: 0,
        note: '',
        client_id: '',
    });

    useEffect(() => {
        if (clientId) {
            setFormData({ ...formData, client_id: clientId })
        }
    }, [clientId])

    useEffect(() => {
        dispatch(getDailyInterestsByClientId(clientId))
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreate = () => {
        dispatch(createDailyInterest(formData)).then(() => dispatch(getDailyInterestsByClientId(clientId)))
        setFormData({ amount: '', note: '' });
    };

    const handleUpdate = (id) => {
        dispatch(updateDailyInterest({ id, updatedData: formData }));
    };

    const handleDelete = (id) => {
        dispatch(deleteDailyInterest(id));
    };

    const handleToggleStatus = (id, status) => {
        // dispatch(toggleDailyInterestStatus({ id, status }));
    };

    return (
        <div className="p-4">
            <h2 className=" font-bold mb-4">Daily Interest Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-400 rounded"
                />
                {/* <input
                    type="number"
                    name="receivedAmount"
                    placeholder="Received Amount"
                    value={formData.receivedAmount}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                /> */}
                <input
                    type="text"
                    name="note"
                    placeholder="Note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-400 rounded"
                />
                <button onClick={handleCreate} className="p-2 bg-blue-500 text-white rounded">
                    Create
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid gap-4">
                {dailyInterests.length > 0 && dailyInterests.map((item) => (
                    <div key={item._id} className="p-4 bg-gradient-to-br from-green-300 via-blue-400 to-purple-500 text-xl border rounded-xl">
                        <p><span className="font-bold">Entry Number:</span> {item.entryNumber}</p>
                        <p><span className="font-bold">Amount:</span> ₹ {item.amount}</p>
                        <p><span className="font-bold">Received Amount:</span> ₹ {item.receivedAmount}</p>
                        <p><span className="font-bold">Note:</span> {item.note}</p>
                        <p><span className="font-bold">Status:</span> {item.status === 1 ? 'Active' : 'Inactive'}</p>
                        <button
                            onClick={() => handleUpdate(item._id)}
                            className="p-2 my-1 bg-yellow-500 text-white rounded mr-2"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => handleToggleStatus(item._id, item.status === 1 ? 0 : 1)}
                            className="p-2 my-1 bg-green-500 text-white rounded mr-2"
                        >
                            Change Status
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyInterestComponent;
