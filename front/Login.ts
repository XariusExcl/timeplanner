export default class Login {
    loginInput: HTMLInputElement;
    passwordInput: HTMLInputElement;

    constructor() {
        this.loginInput = document.querySelector('[data-ref="loginInput"]');
        this.passwordInput = document.querySelector('[data-ref="passwordInput"]');
        this.eventListener();
    }

    public eventListener = () => {
        console.log(this.loginInput);
        console.log(this.passwordInput);
    };
}
