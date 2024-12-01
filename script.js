// Aguarda o carregamento do DOM para garantir que os elementos estão disponíveis
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o botão "Agendar Agora"
    const btnAgendar = document.querySelector('.btn-agendar');
    
    // Adiciona um evento de clique ao botão "Agendar Agora"
    btnAgendar.addEventListener('click', (event) => {
        event.preventDefault();  // Evita o comportamento padrão do botão
        alert('Você clicou para agendar!');  // Exibe um alerta
    });
    
    // Cria dinamicamente um botão para mudar a cor de fundo
    const btnMudarCor = document.createElement('button');
    btnMudarCor.textContent = "Mudar Cor de Fundo";  // Texto do botão
    btnMudarCor.style.position = "fixed";  // Fixa o botão na tela
    btnMudarCor.style.bottom = "20px";  // Distância da parte inferior
    btnMudarCor.style.left = "20px";  // Distância da parte esquerda
    btnMudarCor.style.padding = "10px 20px";  // Espaçamento interno
    btnMudarCor.style.backgroundColor = "#ff80b2";  // Cor de fundo do botão
    btnMudarCor.style.color = "white";  // Cor do texto
    btnMudarCor.style.border = "none";  // Remove a borda
    btnMudarCor.style.borderRadius = "5px";  // Arredonda os cantos
    btnMudarCor.style.cursor = "pointer";  // Adiciona o cursor de clique
    document.body.appendChild(btnMudarCor);  // Adiciona o botão ao corpo do documento

    // Adiciona um evento de clique ao botão "Mudar Cor de Fundo"
    btnMudarCor.addEventListener('click', () => {
        document.body.style.backgroundColor = "#ffedf2";  // Define uma nova cor de fundo
    });
});
