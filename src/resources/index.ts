export interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// Registro vacío de recursos para extensión futura
export const resources: McpResource[] = [];
