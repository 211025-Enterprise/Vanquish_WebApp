import axios from "axios";
import React, { useState } from "react";
//import './User.css';
import useToken from "../Models/Token";
import PropTypes from 'prop-types';
import {Link, Navigate } from 'react-router-dom';
import APIQuery from "../Models/APIQuery";

//Constants to query the API
const apiLoginUrl = '/public/users/login'

//Axios query for login information
async function loginUser(user) {
    return await APIQuery.post(apiLoginUrl,
        JSON.stringify(user),)
        .then(data => data.data.jwt)
}

//Login functionality of the login page
export default function Login({ setToken }) {
    //React useState to watch for userName and password
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    //Functionality of the button used to submit login information
    const submitButton = async e => {
        e.preventDefault();
        const jwt = await loginUser({
            username,
            password
        });
        setToken(jwt);
    }

    //Returning a login page rendered in HTML
    return (
        useToken().token ? <Navigate to="/" /> :
        <div className="login">
            <h1>Please login to continue</h1>
            <form onSubmit={submitButton}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div className="button">
                    <button type="submit">Submit</button>
                </div>
            </form>
            <Link to="/register">Don't have an account? Click here.</Link>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};