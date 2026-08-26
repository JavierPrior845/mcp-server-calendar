import { google, calendar_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

const PROJECT_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });

const TOKEN_PATH = path.join(PROJECT_ROOT, 'tokens.json');

function getAuthClient() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI || 'http://localhost:3000';

  if (!clientId || !clientSecret) {
    throw new Error('Faltan CLIENT_ID o CLIENT_SECRET en el .env');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error('No existe tokens.json. Por favor ejecuta: npm run auth');
  }

  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  oauth2Client.setCredentials(tokens);

  oauth2Client.on('tokens', (newTokens) => {
    if (newTokens.refresh_token) {
      tokens.refresh_token = newTokens.refresh_token;
    }
    tokens.access_token = newTokens.access_token;
    tokens.expiry_date = newTokens.expiry_date;
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  });

  return oauth2Client;
}

export function getCalendarClient(): calendar_v3.Calendar {
  const auth = getAuthClient();
  return google.calendar({ version: 'v3', auth });
}
