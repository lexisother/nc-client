import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import Narrowcast from './components/Narrowcast';
import NarrowcastSelector from './components/NarrowcastSelector';

export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NarrowcastSelector />} />
        <Route path="/:slug" element={<Narrowcast />} />
      </Routes>
    </Router>
  );
}
