export interface LinkMenu {
  para: string;
  rotulo: string;
}

// Links do menu principal (cinco páginas institucionais + páginas da solução).
export const LINKS_MENU: LinkMenu[] = [
  { para: '/', rotulo: 'Início' },
  { para: '/dicas', rotulo: 'Dicas' },
  { para: '/sobre', rotulo: 'Sobre' },
  { para: '/integrantes', rotulo: 'Integrantes' },
  { para: '/faq', rotulo: 'FAQ' },
  { para: '/contato', rotulo: 'Contato' },
];

export const LINK_AUTOAVALIACAO: LinkMenu = { para: '/autoavaliacao', rotulo: 'Fazer autoavaliação' };
