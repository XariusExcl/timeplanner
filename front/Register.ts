const axios = require('axios');
export default class Register {
    loginInput: HTMLInputElement;
    passwordInput: HTMLInputElement;
    submitInput: HTMLElement;

    constructor() {
        this.loginInput = document.querySelector('[data-ref="registerLogin"]');
        this.passwordInput = document.querySelector('[data-ref="registerPassword"]');
        this.submitInput = document.querySelector('[data-ref="registerSubmit"]');
        this.eventListener();
    }

    public eventListener = () => {
        this.submitInput.addEventListener('click', async () => {
            let response = await this.getToken(this.loginInput, this.passwordInput);
            if(response.status == 200) {
                location.reload();
            }
        })
    };

    async getToken(login, password) {

        let response = await axios(
            {
                method: 'post',
                url: 'http://localhost:8888/index.php/register',   
                data: {
                    email: login.value,
                    password: password.value 
                }
            }
        )
        
        return response;
    }
}
