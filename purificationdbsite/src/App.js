import './styles/App.css';
import { Route, Routes } from 'react-router';
import { Home } from './pages/Home';
import { Database } from './pages/Database';
import { Search } from './pages/Search';
import { Entry } from './pages/Entry';



function App() {
  return (
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Database' element={<Database />} />
          <Route path='/Search' element={<Search />} />
          <Route path='/Entry' element={<Entry />} />
          
        </Routes>
      </div>
  );
}

export default App;
