import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import SignIn from './pages/signin';
import Login from './pages/login';


function App() {
    
  return (
    <>

      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home/>} />
          <Route path="/sign" element={<SignIn/>} />
          <Route path="/login" element={<Login/>} />
          
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App