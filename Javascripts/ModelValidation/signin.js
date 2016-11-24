/* For Javascript ES6 */

class signin extends validationModel {
    validateFields(){
        return {
            email: [validators.required, validators.email],  
            password: [validators.required, validators.pattern(/^[0-5]{3,5}$/)]  
        };
    }
}

let requestData = {
    email: 'ttvone@hotmail.com',
    password: '154'
};


let model = new signin(requestData);

// or
// let model = new validationModel(requestData, {
//     email: [validators.required, validators.email],  
//     password: [validators.required, validators.pattern(/^[0-5]{3,5}$/)]  
// });

console.log(model.valid);


/* For Javascript ES5 */

//    var signin = function(validationModel){    
//        function signin(model){
//            this.validateFields = function(){
//                return {
//                    email: [validators.required, validators.email],  
//                    password: [validators.required, validators.pattern(/^[0-5]{4,5}$/)]  
//                };
//            };
//
//            return new validationModel(model, this.validateFields());
//        }
//        return signin;
//    }(validationModel);
//
//    var model = new signin({
//        email: 'ttvone@hotmail.com',
//        password: '154'
//    });
//
//    console.log(model);
