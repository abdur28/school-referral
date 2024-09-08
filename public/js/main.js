// обработчик события генерации ссылки
document.querySelector('#generate-link').addEventListener('click', async () => {
    const referrerId = document.querySelector('#referrerId').value;
    try {
        const response = await fetch(`/generate-link`, {
            method: 'POST',
        });
        if (response.ok) {
            const data = await response.json();
            const link = data.link;
            const linkBox = document.querySelector('#link-box');
            linkBox.style.display = 'block';
            linkBox.innerHTML = `<span>${link}</span>`;
        } else {
          console.error('Ошибка генерации ссылки:', error);
          window.location.href = '/';
        }
    } catch (error) {
        console.error('Ошибка генерации ссылки:', error);
    }    
});

// обработчик события регистрации
document.querySelector('#registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fullName = document.querySelector('#fullName').value;
    const phoneNumber = document.querySelector('#phoneNumber').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const referrerId = document.querySelector('#referrerId').value;

    try {
        const response = await fetch(`/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                phoneNumber,
                email,
                password,   
                referrerId,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            const message = data.message;
            alert(message)
        } else {
          console.error('Ошибка регистрации:', error);
          window.location.href = '/';
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        window.location.href = '/';
    }
});

// обработчик события входа
document.querySelector('#signInForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    try {
        const response = await fetch(`/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,   
            }),
        });
        if (response.ok) {
            const data = await response.json();
            // const token = data.token;
            // localStorage.setItem('token', token);
            window.location.href = '/';
        } else {
          console.error('Ошибка регистрации:', error);
          window.location.href = '/';
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        window.location.href = '/';
    }
});

// обработчик события оплаты
document.querySelector('#paymentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const fullName = document.querySelector('#fullName').value;
    const address = document.querySelector('#address').value;
    try {
        const response = await fetch(`/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email,
                fullName,
                address,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            // const token = data.token;
            // localStorage.setItem('token', token);
            // window.location.href = '/';
        } else {
          console.error('Ошибка оплаты:', error);
          window.location.href = '/';
        }
    } catch (error) {
        console.error('Ошибка оплаты:', error);
        window.location.href = '/';
    }
})
