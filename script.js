// Animações suaves para rolagem entre seções
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mensagem de redirecionamento para WhatsApp ao clicar no botão "Entrar em Contato"
document.querySelector('.btn-agendar').addEventListener('click', () => {
    alert("Você será redirecionado para o WhatsApp.");
});
document.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= windowHeight * 0.8 && !section.classList.contains('fade-in')) {
            section.classList.add('fade-in');
            section.style.opacity = '1';
        }
    });
});
let timer;
document.addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        const sections = document.querySelectorAll('section');
        const windowHeight = window.innerHeight;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= windowHeight * 0.8 && !section.classList.contains('fade-in')) {
                section.classList.add('fade-in');
                section.style.opacity = '1';
            }
        });
    }, 100); // Delay de 100ms para melhorar o desempenho
});
window.addEventListener('scroll', () => {
    const btnTopo = document.getElementById('btnTopo');
    if (window.scrollY > 300) {
        btnTopo.style.display = 'block';
    } else {
        btnTopo.style.display = 'none';
    }
});

function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// Código para o efeito de fade nas seções ao rolar a página
document.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= windowHeight * 0.8) {
            section.style.opacity = '1';
            section.style.transition = 'opacity 1.5s ease-out';
        }
    });
});

// Transição de fade-in no cabeçalho
document.addEventListener('DOMContentLoaded', function () {
    const headerTitle = document.querySelector('header h1');
    headerTitle.classList.add('fade-in-up');
});