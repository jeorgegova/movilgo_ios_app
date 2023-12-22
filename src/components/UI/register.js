import { PureComponent } from 'react'
export default class Register extends PureComponent {
    constructor() {
        super();
        this.inputsToVerify = [];
        this.state = {
            allOk: false
        }
    }
    handleChange = (name, value) => {
        this.setState({
            [name]: {
                name,
                value,
                error: '',
                type: this.state[name].type,
                required: this.state[name].required
            }
        });
    }
    handleRelease = (name) => {
        this.verifyField(name);
    }
    verifyField = (name) => {

        const value = this.state[name].value;
        const type = this.state[name].type;
        const required = this.state[name].required;
        let errorMessage = "";
        if (required) {

            if (typeof (value) == 'string') {
                if (value.trim() === "") {
                    errorMessage = "Este campo es obligatorio";
                }
                switch (type) {
                    case "email":
                        const emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                        errorMessage = emailValid ? "" : 'El email no es valido';
                        break;
                    case 'mobile':
                        if (value.length > 10 || value.length < 10) {
                            errorMessage = 'El numero de celular no es valido';
                        }
                        break;
                    case 'phone':
                        if (value.length > 10 || value.length < 10) {
                            errorMessage = 'El número no es valido';
                        }
                        break;
                    case 'password':
                        if (value.length > 4) {

                            errorMessage = 'La contraseña es demasiado extensa';
                        }
                        break;
                    case 'passwordRepeat': {
                        if (value !== this.state.password.value) {
                            errorMessage = 'Las contraseñas no coinciden';
                        }
                        break;
                    }

                    default:
                        break;
                }
            }
        }
        if (errorMessage !== "") {
            this.setState({
                [name]: {
                    name,
                    value: this.state[name].value,
                    error: errorMessage,
                    type: this.state[name].type,
                    required: this.state[name].required
                }
            })
            return true;
        } else {
            return false;
        }
    }
    verifyForm = () => {
        let allOK = true;
        this.inputsToVerify.forEach(key => {
            let error = this.verifyField(key);
            if (error) {
                allOK = false;
            }
        });
        this.setState({ allOK });
        return allOK;

    }
}