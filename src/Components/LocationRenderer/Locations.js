import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import APIQuery from "../../Models/APIQuery";
import LocationRenderer from "./LocationRenderer.js";
import Navbar from "../Navbar/Navbar";

//Constants to query the API
const tokenString = sessionStorage.getItem('token');
const apiLocationUrl = '/location'


//Location page
export default function Location(userLocation) {
    //React useState to watch for a zipcode
    const [location, setLocation] = useState();
    const [zipCode, setZipCode] = useState();
    const [search, setSearch] = useState();

    //Axios query for location information
    async function getLocation(zipCode) {
        return await APIQuery.post(apiLocationUrl,
            JSON.stringify(zipCode),
            {
                headers: {
                    Authorization: JSON.parse(tokenString)
                }
            })
            .then(data => setSearch(data))
    }
    function addToList(element) {
        // sessionStorage.setItem('locationId', JSON.stringify(element.locationId));
        sessionStorage.setItem('locationId', element.locationId);
        console.log(element.locationId);
    }
    //Functionality of the button used to submit zipcode
    const submitButton = async e => {
        e.preventDefault();
        const locationData = await getLocation({
            zipCode,
        });
        setLocation(locationData);
    }
    console.log(location);
    const locationString = sessionStorage.getItem('location');
    //console.log(locationString)
    if (locationString) return <Navigate to="/" />

    //Returning a login page rendered in HTML
    return (
        locationString ? <Navigate to="/" /> :
            <div className="Location">
                <Navbar />
                <h1>Please enter a zip code to continue</h1>
                <form onSubmit={submitButton}>
                    <label>
                        <p>Zipcode</p>
                        <input type="text" onChange={e => setZipCode(e.target.value)} />
                    </label>
                    <div className="button">
                        <button type="submit">Submit</button>
                    </div>
                    <LocationRenderer data={search} addToList={addToList} key={search} />
                </form>
            </div>
    )
}