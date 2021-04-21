import React, {useState,useEffect,useContext} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


import Navbar from './Navbar'
import Dashboard from './Dashboard'

function App() {
    
    return (
        <div className="App">
            <Router>
                <Navbar></Navbar>
                <br></br>
                <Switch>
                    <Route  path="/">
                        <Dashboard></Dashboard>
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App