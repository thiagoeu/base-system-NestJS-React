import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Dashboard Principal</h1>

      {user ? (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <p>
            Sessão ativa para: <strong>{user.email}</strong>
          </p>
          <p>
            ID do Usuário: <small>{user.id}</small>
          </p>
        </div>
      ) : (
        <p>Carregando dados do usuário...</p>
      )}

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 15px",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Sair do Sistema
      </button>
    </div>
  );
};

export default Home;
