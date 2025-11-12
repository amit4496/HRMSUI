import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


const Protected = (props) => {
    const { Component } = props;
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('token')
        // Note: navigate() from useNavigate automatically handles base path
        // because we configured BrowserRouter with basename
        if (!userData) {
            navigate('/')
        }
    })
    return (
        <div>
            <Component />
        </div>
    )
}


export default Protected