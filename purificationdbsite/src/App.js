import './styles/App.css';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import {Database} from './pages/Database';



function App() {
  return (
      <div className="App">
        <Routes>
          <Route path='/Home' element={<Home />} />
          <Route path='/Database' element={<Database />} />
          
        </Routes>
      </div>
  );
}

export default App;
