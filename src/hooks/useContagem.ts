import { useEffect, useRef, useState } from 'react';
import { useReduzirMovimento } from './useReduzirMovimento';

/** Anima um número até o valor alvo (contagem animada do panorama). */
export function useContagem(alvo: number, duracaoMs = 600): number {
  const reduzir = useReduzirMovimento();
  const [valor, setValor] = useState(alvo);
  const atual = useRef(alvo);

  useEffect(() => {
    if (reduzir) {
      atual.current = alvo;
      setValor(alvo);
      return;
    }
    const inicio = atual.current;
    const comeco = performance.now();
    let quadro = 0;

    const passo = (agora: number) => {
      const progresso = Math.min((agora - comeco) / duracaoMs, 1);
      const suave = 1 - Math.pow(1 - progresso, 3); // desacelera no final
      atual.current = inicio + (alvo - inicio) * suave;
      setValor(atual.current);
      if (progresso < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [alvo, duracaoMs, reduzir]);

  return valor;
}
