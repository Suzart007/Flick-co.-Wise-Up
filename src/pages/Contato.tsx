import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Field, classeControle } from '../components/Field';
import { Container, Rotulo, Titulo } from '../components/Secao';
import { EMAIL_CONTATO } from '../data/contato';
import { useTitulo } from '../hooks/useTitulo';
import type { Erros, FormContato } from '../types/formulario';
import { focarPrimeiroErro, validarContato } from '../utils/validacao';

const VAZIO: FormContato = { nome: '', email: '', assunto: '', mensagem: '' };

export function Contato() {
  useTitulo('Contato');
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormContato>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [aberto, setAberto] = useState(false);

  function alterar(campo: keyof FormContato, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    // Limpa o erro do campo assim que a pessoa volta a digitar.
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: '' }));
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    setAberto(false);
    const encontrados = validarContato(form);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      focarPrimeiroErro(formRef.current, encontrados);
      return;
    }

    // Não há chamada de rede aqui: montamos um mailto e o app de e-mail da pessoa faz o envio.
    const corpo = `${form.mensagem}\n\n— ${form.nome} (${form.email})`;
    const link =
      `mailto:${EMAIL_CONTATO}` +
      `?subject=${encodeURIComponent(`[WISE UP] ${form.assunto}`)}` +
      `&body=${encodeURIComponent(corpo)}`;
    window.location.href = link;
    setAberto(true);
  }

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Rotulo>Contato</Rotulo>
        <Titulo nivel={1} className="mt-4 !text-4xl sm:!text-6xl">
          Vamos conversar
        </Titulo>
        <p className="mt-6 text-lg text-gray-700">
          Quer levar o WISE UP para a sua instituição ou tem uma sugestão? Preencha abaixo e abrimos o seu app de e-mail
          com a mensagem pronta.
        </p>

        <form ref={formRef} noValidate onSubmit={enviar} className="mt-10 grid gap-6">
          <Field label="Seu nome" obrigatorio erro={erros.nome}>
            {(a) => (
              <input
                {...a}
                name="nome"
                type="text"
                autoComplete="name"
                value={form.nome}
                onChange={(e) => alterar('nome', e.target.value)}
                className={classeControle(Boolean(erros.nome))}
              />
            )}
          </Field>
          <Field label="Seu e-mail" obrigatorio erro={erros.email} dica="Usamos só para responder a sua mensagem.">
            {(a) => (
              <input
                {...a}
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => alterar('email', e.target.value)}
                className={classeControle(Boolean(erros.email))}
              />
            )}
          </Field>
          <Field label="Assunto" obrigatorio erro={erros.assunto}>
            {(a) => (
              <input
                {...a}
                name="assunto"
                type="text"
                value={form.assunto}
                onChange={(e) => alterar('assunto', e.target.value)}
                className={classeControle(Boolean(erros.assunto))}
              />
            )}
          </Field>
          <Field label="Mensagem" obrigatorio erro={erros.mensagem}>
            {(a) => (
              <textarea
                {...a}
                name="mensagem"
                rows={6}
                value={form.mensagem}
                onChange={(e) => alterar('mensagem', e.target.value)}
                className={`${classeControle(Boolean(erros.mensagem))} resize-y`}
              />
            )}
          </Field>

          {Object.values(erros).some(Boolean) && (
            <Alert tipo="erro" titulo="Faltam alguns detalhes">
              Confira os campos destacados e tente enviar de novo.
            </Alert>
          )}
          {aberto && (
            <Alert tipo="sucesso" titulo="Abrimos seu app de e-mail">
              Revise a mensagem e toque em enviar por lá. Se nada abriu, escreva para {EMAIL_CONTATO}.
            </Alert>
          )}

          <div>
            <Button type="submit" tamanho="lg">
              Enviar mensagem
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}
