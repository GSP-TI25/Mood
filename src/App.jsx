import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import AdnMood from './pages/AdnMood/AdnMood';

const App = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={<Home />}
      />
      <Route
        path='/adn-mood'
        element={<AdnMood />}
      />
    </Routes>
  );
};

export default App;
