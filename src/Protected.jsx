import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


const Protected = (props) => {
    const { Component } = props;
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('token')
        // if (userData == undefined || userData == null) {
        //     navigate('/')
        // }
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