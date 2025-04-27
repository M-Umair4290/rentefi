import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';

// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Login />
        {/* <Footer /> */}


        {/* <Routes> */}
        {/* <Route path='/' element={<Home />}></Route> */}
        {/* </Routes> */}
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
