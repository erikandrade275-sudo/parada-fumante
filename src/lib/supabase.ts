import { createClient } from '@supabase/supabase-js';

// Validar se a URL é válida
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Função para obter variáveis de ambiente de forma segura
const getEnvVar = (key: string): string | undefined => {
  if (typeof window !== 'undefined') {
    // Cliente: usar variáveis públicas
    return (window as any)[key] || process.env[key];
  }
  // Servidor: usar process.env
  return process.env[key];
};

// Validar se as variáveis de ambiente estão configuradas
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Criar cliente Supabase apenas se as variáveis estiverem configuradas corretamente
export const supabase = 
  isValidUrl(supabaseUrl) && supabaseAnonKey
    ? createClient(supabaseUrl!, supabaseAnonKey)
    : null;

// Helper para verificar se o Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

// Tipos para o banco de dados
export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  is_sensitive: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AppConfig {
  id: string;
  app_url: string;
  resend_api_key?: string;
  keoto_webhook_secret?: string;
  openai_api_key?: string;
  created_at: string;
  updated_at: string;
}
