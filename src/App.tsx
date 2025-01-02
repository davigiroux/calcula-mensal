import "./App.css";
import { Form } from "./components/Form";

function App() {
  return (
    <div className="background">
      <header className="header">
        <h1>Calculadora</h1>
      </header>
      <main className="content">
        <Form />
      </main>
    </div>
  );
}

export default App;
