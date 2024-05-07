document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const senha = document.getElementById("senha").value;

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nome: nome, senha: senha })
            });

            if (response.ok) {
                window.location.href = "http://127.0.0.1:5000"; 
            } else {
                document.getElementById("errorMessage").style.display = "block";
            }
        } catch (error) {
            console.error("Erro durante a requisição:", error);
            document.getElementById("errorMessage").style.display = "block";
        }
    });
});
