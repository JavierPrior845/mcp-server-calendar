import { google } from 'googleapis';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'url';
import dotenv from 'dotenv';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const PROJECT_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });
const TOKEN_PATH = path.join(PROJECT_ROOT, 'tokens.json');
const REDIRECT_PORT = 3000;
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}`;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Faltan CLIENT_ID o CLIENT_SECRET en el .env');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('\n=== AUTENTICACIÓN GOOGLE CALENDAR ===\n');
console.log('1. Abre esta URL en tu navegador:');
console.log(authUrl);
console.log('\nEsperando a que autorices la aplicación en el navegador...');

const server = http.createServer(async (req, res) => {
  try {
    const urlParts = parse(req.url || '', true);
    if (urlParts.pathname === '/') {
      const code = urlParts.query.code as string;
      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Autenticación exitosa</h1><p>Ya puedes cerrar esta ventana y volver a la terminal.</p>');
        server.close();

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
        console.log(`\n✅ Autenticación exitosa. Tokens guardados en ${TOKEN_PATH}`);
        process.exit(0);
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Error: No se recibio el codigo de autorizacion');
      }
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error interno');
    console.error(error);
  }
});

server.listen(REDIRECT_PORT, () => {
  console.log(`\n(Servidor de callback escuchando en ${REDIRECT_URI})`);
});
