"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Importar Auth de forma dinâmica para evitar problemas de SSR
const Auth = dynamic(
  () => import('@supabase/auth-ui-react').then(mod => mod.Auth),
  { ssr: false }
);

const ThemeSupa = dynamic(
  () => import('@supabase/auth-ui-shared').then(mod => mod.ThemeSupa),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Importar e configurar Supabase apenas no cliente
    const initSupabase = async () => {
      try {
        const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
        
        if (isSupabaseConfigured()) {
          setSupabaseClient(supabase);
          setIsConfigured(true);

          // Verificar se usuário já está logado
          const { data: { session } } = await supabase!.auth.getSession();
          if (session) {
            router.push('/dashboard');
            return;
          }

          // Listener para mudanças de autenticação
          const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
            if (session) {
              router.push('/dashboard');
            }
          });

          setLoading(false);

          return () => subscription.unsubscribe();
        } else {
          setIsConfigured(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao inicializar Supabase:', error);
        setIsConfigured(false);
        setLoading(false);
      }
    };

    initSupabase();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o Supabase não estiver configurado, mostrar mensagem
  if (!isConfigured || !supabaseClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
        <header className="p-4 sm:p-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para home
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Configuração Necessária
            </h2>
            <p className="text-gray-600">
              O sistema de autenticação precisa ser configurado. Entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para home
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card de Login */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header do Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
              <p className="text-emerald-100">
                Sua jornada para a liberdade começa aqui
              </p>
            </div>

            {/* Formulário de Autenticação */}
            <div className="p-8">
              {supabaseClient && (
                <Auth
                  supabaseClient={supabaseClient}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#059669',
                          brandAccent: '#047857',
                        },
                      },
                    },
                    className: {
                      container: 'space-y-4',
                      button: 'w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300',
                      input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
                      label: 'block text-sm font-medium text-gray-700 mb-2',
                    },
                  }}
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: 'E-mail',
                        password_label: 'Senha',
                        email_input_placeholder: 'seu@email.com',
                        password_input_placeholder: 'Sua senha',
                        button_label: 'Entrar',
                        loading_button_label: 'Entrando...',
                        social_provider_text: 'Entrar com {{provider}}',
                        link_text: 'Já tem uma conta? Entre',
                      },
                      sign_up: {
                        email_label: 'E-mail',
                        password_label: 'Senha',
                        email_input_placeholder: 'seu@email.com',
                        password_input_placeholder: 'Crie uma senha forte',
                        button_label: 'Criar conta',
                        loading_button_label: 'Criando conta...',
                        social_provider_text: 'Cadastrar com {{provider}}',
                        link_text: 'Não tem uma conta? Cadastre-se',
                      },
                      forgotten_password: {
                        email_label: 'E-mail',
                        password_label: 'Senha',
                        email_input_placeholder: 'seu@email.com',
                        button_label: 'Enviar instruções',
                        loading_button_label: 'Enviando...',
                        link_text: 'Esqueceu sua senha?',
                      },
                    },
                  }}
                  providers={[]}
                  redirectTo={redirectUrl}
                />
              )}

              {/* Benefícios */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Ao criar sua conta, você terá acesso a:
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Método completo de 21 dias para parar de fumar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Comunidade exclusiva de apoio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Plano personalizado baseado no seu perfil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Acompanhamento diário do seu progresso</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Garantia */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              🔒 Seus dados estão seguros • Garantia de 30 dias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Forçar renderização dinâmica (não fazer prerender)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
