import Link from "next/link";

type Produto = {
  id: string;
  titulo: string;
  autor: string;
  preco: number;
  tipo: "fisico" | "digital";
  imagem?: string;
};

async function getProdutos(): Promise<Produto[]> {
  const res = await fetch("http://localhost:3003/api/produtos", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Produtos() {
  const produtos = await getProdutos();

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          background: "#2c3e50",
          color: "white",
          padding: "1rem 2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href="/">
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", cursor: "pointer" }}>
              COMPIA Editora
            </h1>
          </Link>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Link href="/produtos" style={{ color: "white", fontWeight: "bold" }}>
              Produtos
            </Link>
            <Link href="/carrinho" style={{ color: "white" }}>
              Carrinho
            </Link>
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Catálogo de Produtos</h2>

        {produtos.length === 0 ? (
          <div
            style={{
              background: "#f8f9fa",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          >
            <p style={{ marginBottom: "1rem", color: "#666" }}>
              Nenhum produto no banco ainda.
            </p>

            <p style={{ marginBottom: "0.75rem" }}>
              Para inserir exemplos, acesse:
              <br />
              <strong>http://localhost:3003/api/produtos/seed</strong>
            </p>

            <p style={{ color: "#666" }}>
              Depois recarregue esta página.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {produtos.map((produto) => (
              <div
                key={produto.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                }}
              >
                <div
                  style={{
                    height: "200px",
                    background: "#f0f0f0",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {produto.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={produto.imagem}
                      alt={produto.titulo}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ color: "#999" }}>Sem imagem</span>
                    </div>
                  )}
                </div>

                <div style={{ padding: "1.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#3498db",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    }}
                  >
                    {produto.tipo === "digital" ? "📱 E-book" : "📚 Físico"}
                  </span>

                  <h3
                    style={{
                      fontSize: "1.2rem",
                      margin: "0.5rem 0",
                      color: "#2c3e50",
                    }}
                  >
                    {produto.titulo}
                  </h3>

                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem" }}>
                    {produto.autor}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#27ae60" }}>
                      R$ {produto.preco.toFixed(2).replace(".", ",")}
                    </span>

                    <button
                      style={{
                        background: "#3498db",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}