import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../Home/Home';
//import { Index } from '../home2ajustandolo';
import { PerfilPokemon } from '../PerfilPokemon/PerfilPokemon';
import './App.css';


function App() {
  return (
    <div className="App">
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/perfil/:pokeId' element={<PerfilPokemon />} />
              </Routes>
            </BrowserRouter>
    </div>
  );
}

export default App;
