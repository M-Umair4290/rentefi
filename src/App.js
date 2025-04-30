import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Navbar /> */}
        {/* <Login /> */}
        {/* <Signup /> */}
        {/* <Footer /> */}


        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />


        </Routes>
      </BrowserRouter>
    </>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
