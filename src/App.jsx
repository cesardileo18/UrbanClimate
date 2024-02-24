import './App.css'
import Error from './Components/Error'
import Home from './Components/Home'
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  )
}

export default App
