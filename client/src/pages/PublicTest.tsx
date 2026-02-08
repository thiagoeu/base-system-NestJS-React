import { Link } from "react-router-dom";

const PublicTest = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Página de Teste Pública</h1>
      <p>Esta página é acessível sem autenticação.</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/login" style={{ marginRight: "10px" }}>
          Ir para Login
        </Link>
        <Link to="/">Ir para Home (Privada)</Link>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "15px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
        }}
      >
        <h3>Status da API</h3>
        <p>
          Você pode usar esta página para validar se o roteamento está
          funcionando corretamente.
        </p>
      </div>
    </div>
  );
};

export default PublicTest;
