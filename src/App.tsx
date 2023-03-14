import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import './App.scss';
import Narrowcast from './components/Narrowcast';
import { gql } from './__generated__/gql';

export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<NarrowcastSelector />} /> */}
        <Route path="/:slug" element={<Narrowcast />} />
      </Routes>
    </Router>
  );
}
