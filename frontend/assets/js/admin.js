document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  form.addEventListener('submit', function(event) {
      event.preventDefault(); // Empêche la soumission par défaut

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Informations d'identification
      const validUsername = 'admin';
      const validPassword = 'password';

      if (username === validUsername && password === validPassword) {
          // Authentification réussie
          window.location.href = 'ajout.html';
      } else {
          // Authentification échouée
          errorMessage.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
      }
  });
});