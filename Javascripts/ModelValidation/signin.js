class signin extends validationModel {
    validateFields(){
        return {
            email: [validators.required, validators.email],  
            password: [validators.required, validators.pattern(/^[0-5]{3,5}$/)]  
        };
    }
}

let model = new signin({
    email: 'ttvone@hotmail.com',
    password: '154'
});

console.log(model);