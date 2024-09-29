import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Home />
      </Layout>
    </Router>
  );
};

export default App;
