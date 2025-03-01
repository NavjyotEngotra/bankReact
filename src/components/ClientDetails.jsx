import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getClientById } from '../redux/slices/clientSlice';
import { useSearchParams } from 'react-router';
import { FaCircle } from 'react-icons/fa';
import DailyInterestComponent from './DailyInterestComponent';

const ClientDetails = () => {
    const [client, setClient] = useState(null);
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const clientId = searchParams.get('clientID');

    useEffect(() => {
        dispatch(getClientById(clientId)).then(data => {
            if (data?.payload?._id)
                setClient(data?.payload)
        })
    }, []);

    if (!client) return <div>Loading...</div>;

    return (
        <div className="h-screen flex flex-col">
            {/* Top 10% Section for Client Details */}
            <h2 className="text-lg font-bold mb-2">Client Details</h2>
            <div className=" p-4 text-sm bg-gray-200 border border-gray-400 rounded-lg justify-start flex flex-col">
                <p className='mr-5' ><strong>Name:</strong> {client?.name}</p>
                <p className='mr-5'><strong>Address:</strong> {client?.address}</p>
                <p className='mr-5'><strong>Business Name:</strong> {client?.businessName}</p>
                <p className='mr-5'><strong>Business Address:</strong> {client?.businessAddress}</p>
                <p className='mr-5'><strong>Mobile Number:</strong> {client?.mobileNumber}</p>
                <p className='mr-5'><strong>Landlord Name:</strong> {client?.landlordName}</p>
                <p className='mr-5'><strong>Landlord Mobile Number:</strong> {client?.landlordMobileNumber}</p>
                <p className='mr-5'><strong>Client Number:</strong> {client.clientNumber}</p>
                <p className='mr-5 flex flex-row'><strong>Status:</strong><FaCircle className={`mt-[5px] mx-2 ${client.status===1?"text-green-500":"text-red-500"} `}/></p>
            </div>
            {/* Remaining 90% for Other Content */}
            <div className="flex-1 bg-white">
                {/* Add additional components or content here */}
                <DailyInterestComponent clientId={clientId}/>
            </div>
        </div>
    );
};

export default ClientDetails;
