import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import './assets/scss/main.scss' 
import Table from './Pages/Table'; 

function App() {


  return (
    <BrowserRouter>
      <div className='content-wrapper'> 
      {/* <Header /> */}
        <Routes>
          <Route path="*" element={<Table />} /> 
          <Route path="/table" element={<Table />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
