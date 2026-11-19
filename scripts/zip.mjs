// Gera wise-up-front.zip SEM node_modules, dist, .git e .env.
// Falha se o arquivo passar de 50 MB (limite da entrega). Uso: npm run zip
import { ZipArchive } from 'archiver';
import { createWriteStream, statSync, rmSync } from 'node:fs';

const SAIDA = 'wise-up-front.zip';
const LIMITE_BYTES = 50 * 1024 * 1024;

const IGNORAR = [
  'node_modules/**',
  'dist/**',
  '.git/**',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.*.local',
  '*.zip',
  '*.log',
  'tsconfig.tsbuildinfo',
  'desktop.ini',
];

rmSync(SAIDA, { force: true });
const saida = createWriteStream(SAIDA);
const arquivo = new ZipArchive({ zlib: { level: 9 } });

saida.on('close', () => {
  const bytes = statSync(SAIDA).size;
  const mb = (bytes / 1024 / 1024).toFixed(2);
  if (bytes > LIMITE_BYTES) {
    rmSync(SAIDA, { force: true });
    console.error(`ERRO: o zip tem ${mb} MB e passa do limite de 50 MB (penalidade de -2 pontos).`);
    process.exit(1);
  }
  console.log(`OK: ${SAIDA} gerado com ${mb} MB (limite: 50 MB).`);
});
arquivo.on('error', (erro) => {
  throw erro;
});

arquivo.pipe(saida);
// dot: true inclui arquivos ocultos como .env.example e .gitignore (os .env reais são ignorados acima).
arquivo.glob('**/*', { dot: true, ignore: IGNORAR });
await arquivo.finalize();
