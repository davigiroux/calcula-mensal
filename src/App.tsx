import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "./utils/supabase";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router";
import { CreatePlan } from "./pages/CreatePlan";
import { Plans } from "./pages/Plans";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_label: "Email",
              email_input_placeholder: "exemplo@email.com",
              password_label: "Senha",
              password_input_placeholder: "Sua senha",
              button_label: "Entrar",
              link_text: "Já tem uma conta? Entre",
            },
            forgotten_password: {
              email_label: "Email",
              email_input_placeholder: "exemplo@email.com",
              button_label: "Enviar",
              link_text: "Esqueceu sua senha?",
            },
            sign_up: {
              email_label: "Email",
              email_input_placeholder: "exemplo@email.com",
              password_label: "Senha",
              password_input_placeholder: "Sua senha",
              button_label: "Criar conta",
              link_text: "Criar conta",
              confirmation_text:
                "Verifique seu email para o link de confirmação",
              loading_button_label: "Criando conta...",
            },
          },
        }}
      />
    );
  } else {
    return (
      <BrowserRouter>
        <div className="background">
          <header className="header">
            <h1 style={{ marginBottom: "20px" }}>Planos Mensais</h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "42px",
              }}
            >
              <Link className="link" to="/">
                Ver Planos
              </Link>{" "}
              |{" "}
              <Link className="link" to="/criar">
                Criar
              </Link>
            </div>
          </header>
          <main className="content">
            <Routes>
              <Route element={<Plans />} index />
              <Route element={<CreatePlan />} path="criar" />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}
