import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import SignIn from './pages/signin';


function App() {
  return (
    <>

      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home/>} />
          <Route path="/sign" element={<SignIn/>} />
          
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App