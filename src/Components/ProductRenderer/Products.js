import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.js';
import APIQuery from "../../Models/APIQuery";
import ProductRenderer from "./ProductRenderer.js";

const apiProductSearchUrl = '/products'
const apiGroceryListUrl = '/grocerylist'



export default function Products() {
    const tokenString = sessionStorage.getItem('token');
    const groceryListId = sessionStorage.getItem('groceryListId')
    const groceryListName = sessionStorage.getItem('groceryListName');
    const locationString = sessionStorage.getItem('locationId');
    const [productName, setProductName] = useState();
    var storeProducts = [];
    const [search, setSearch] = useState();

    console.log(tokenString);

    async function searchProduct(searchQuery) {
        const tokenString = sessionStorage.getItem('token');
        return await APIQuery.post(apiProductSearchUrl,
            JSON.stringify(searchQuery),
            {
                headers: {
                    Authorization: JSON.parse(tokenString)
                }
            })
            .then(data => setSearch(data))
    }

    async function getUserId() {
        return await APIQuery.get('/users/current',{
            headers:{
                Authorization: JSON.parse(tokenString),
            }
        }).then(data => data.data.userId)
    }

    async function addToList(element) {
        // var userId = await getUserId();
        const path = apiGroceryListUrl+'/'+groceryListName+'/'+locationString+'/'+element.productId+'/'+1;
        // console.log(path);

        APIQuery.post(path,{},{headers:{
            Authorization: JSON.parse(tokenString)
        }})
    }

    const submitButton = async e => {
        e.preventDefault();
        console.log("Here is what is sent");
        storeProducts = await searchProduct({
            'term': productName,
            'locationId': locationString
        });
        console.log(search);
    }

    return (
        !tokenString ? <Navigate to="/login" /> :
            !locationString ? <h1>Please select a location before searching products</h1> :
                !groceryListId ? <h1> Please select a grocery List, the come back!</h1> :
                    <>
                        <Navbar />
                        <h1>Welcome to products!</h1>
                        <form onSubmit={submitButton}>
                            <label>
                                <p>Item Lookup</p>
                                <input type="text" onChange={e => setProductName(e.target.value)} />
                            </label>
                            <div className="button">
                                <button type="submit">Submit</button>
                            </div>
                            <ProductRenderer data={search} addToList={addToList} key={search} />
                        </form>
                    </>
    )
}