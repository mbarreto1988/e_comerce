document.addEventListener('DOMContentLoaded', () => {    
    class Alerts{
        static showError(message) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message
            });
        }

        static successful(message){
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: message,
                timer: 1500,
                showConfirmButton: false
            });
        }

        static paySuccessful(message){
            Swal.fire({
                icon: 'success',
                title: '¡Compra realizada!',
                text: message,
                timer: 1500,
                showConfirmButton: false
            });
        }

        static errorAuth(message){
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: message
            });
        }
    }


    const API_BASE_URL = 'https://fakestoreapi.com';
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === '' || password === '') {
            Alerts.showError('Por favor, completa todos los campos.')
            return;
        }
        fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.token) {
                Alerts.successful('Bienvenido!')
                localStorage.setItem('authToken', json.token);
                localStorage.setItem('showPayAlert', 'true');                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                Alerts.errorAuth('Usuario o contraseña incorrectos')
            }
        })
        .catch(error => {
            Alerts.errorAuth('Usuario o contraseña incorrectos')
            console.error('Error:', error);
        });
    });
});
