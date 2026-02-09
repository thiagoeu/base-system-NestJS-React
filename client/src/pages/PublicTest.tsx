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
        <Link to="/home">Ir para Home (Privada)</Link>
      </div>
    </div>
  );
};

export default PublicTest;
