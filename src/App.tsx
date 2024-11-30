import { useState } from 'react'
import { HomeRoute } from './routes/home.route';
import Login from './routes/login.route';
import { AjouterEmpruntRoute } from './routes/ajouterEmprunt.route';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { LangueContext } from './contexts/langue.context';
import { IntlProvider } from 'react-intl';
import Francais from './lang/fr.json';
import Anglais from './lang/en.json';
import { useContext } from 'react';
function App() {
  const { langue } = useContext(LangueContext);
  const { messageLangue } = useContext(LangueContext);
  return (
    <IntlProvider locale={langue} messages={messageLangue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ajouter" element={<AjouterEmpruntRoute />} />
        </Routes>
      </BrowserRouter>
    </IntlProvider>
  )
}

export default App