import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { demoRequest } from '../redux/slices/demoslice'

const Home = () => {
    const navigate = useNavigate()
    const data = useSelector((state) => state.demoData.data)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(demoRequest());
      }, [dispatch]);

    return (
        <div>
            Home Page
            <br />
            <h1 className='text-blue-700 text-xs cursor-pointer' onClick={() => navigate("/authLayout")}>Navigate by useNavigate to Login Page</h1>
            <Link className='text-blue-700 text-xs cursor-pointer' to="/authLayout">Navigate by Link to Login Page</Link>
        </div>
    )
}

export default Home
