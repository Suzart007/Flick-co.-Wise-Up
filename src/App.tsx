import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Autoavaliacao } from './pages/Autoavaliacao';
import { Contato } from './pages/Contato';
import { Dicas } from './pages/Dicas';
import { Faq } from './pages/Faq';
import { Home } from './pages/Home';
import { IntegranteDetalhe } from './pages/IntegranteDetalhe';
import { Integrantes } from './pages/Integrantes';
import { NaoEncontrada } from './pages/NaoEncontrada';
import { Reavaliacao } from './pages/Reavaliacao';
import { Resultado } from './pages/Resultado';
import { Sobre } from './pages/Sobre';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Institucionais */}
        <Route index element={<Home />} />
        <Route path="integrantes" element={<Integrantes />} />
        <Route path="integrantes/:id" element={<IntegranteDetalhe />} />
        <Route path="sobre" element={<Sobre />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contato" element={<Contato />} />
        {/* Solução */}
        <Route path="autoavaliacao" element={<Autoavaliacao />} />
        <Route path="resultado/:id" element={<Resultado />} />
        <Route path="reavaliacao/:id" element={<Reavaliacao />} />
        <Route path="dicas" element={<Dicas />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}
