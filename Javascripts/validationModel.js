// Message validate
const validation_messages = {
    required: 'The field is required.',
    pattern: 'The field is invalid.',
    email: 'The field is email.',
    password: 'The field is password.',
    maxlength: 'The field is maximum {0}.',
    minlength: 'The field is minimum {0}.',
    special_characters: 'The field is special characters.'
};
// Patterns validate
class validators {
    static required(value) {
        if(value.toString().trim() == ''){ return { required: '' } }
        return;
    }
    static email(value){
        if(!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(value)){ return { email: '' }; }
        return;
    }
    static password(value){
        if(!(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*-_]{8,20}$/).test(value)){ return { password: '' }; }
        return;
    }
    static special_characters(value){
        if(!(/^((?!([~`!#$%\^&*+=\[\]\\';,/{}|\\"":<>\?@])).)+$/).test(value)){ return { special_characters: '' }; }
        return;
    }
    static pattern(pattern){
        return (value) => {
            if(!pattern.test(value)){ return { pattern: pattern }; }
            return;
        };
    }
    static maxlength(length){
        return (value) => {
            if(value.length > length){ return { maxlength: length }; }
            return;
        }
    }
    static minlength(length){
        return (value) => {
            if(value.length < length){ return { minlength: length }; }
            return;
        }
    }
};
// Class validate
class validation_model {

    constructor(model){
        this.model = this.hasModel(model);
        this.controls = {};
        this.errors = [];
        this.validateValid();
        this.valid = this.errors.length == 0;
        this.invalid = this.errors.length > 0;
        this.value = this.model;
        this.fields = (function(){
            let field = this.validateFields();
            let fields = [];
            for(let i in field)
                fields.push(i);
            return fields;

        }).call(this);
        this.messages = (function(){
            var messages = [];
            this.errors.forEach(error => {
                for(let property in error){
                    messages.push(this.getErrorMessage(property, error));      
                }
            });
            return messages;
        }).call(this);
        delete this.model;
        delete this.validateFields;
        delete this.validateValid;
        delete this.hasModel;
        delete this.addError;
        delete this.addErrorModels;
    }

    validateFields(){ 
        return {}; 
    }

    validateValid(){
        const model = this.hasModel(this.model);
        const field = this.validateFields();
        // find variable
        for(let variable in field){
            // find property
            for(let property in model){
                // check property equals variable
                if(property === variable){
                    // for the models
                    this.controls[property] = {
                        messages: [],
                        validators: [],
                        value: model[property],
                        valid: null,
                        invalid: null
                    };
                    // check value must not object
                    if(typeof model[property] == 'object') return;
                    // set functions
                    let validator = field[variable];
                    // set value
                    let value = model[property];
                    // find functions
                    for(let i in validator){
                        let validatorFunction = validator[i];
                        this.addError(validatorFunction, validatorFunction.name, property, value);
                    }
                }  
            }
        }
        // modify controls change valid and invalid 
        for(let prop in this.controls){
            let variable = this.controls[prop];
            this.controls[prop].valid = this.controls[prop].messages.length == 0;
            this.controls[prop].invalid = this.controls[prop].messages.length > 0;
        }
    }

    hasModel(model) {
        if(!model) throw ('ValidationModel class is Error [ please input model in class ]');
        return model;
    }

    addError(validatorFunction, patterns, property, value) {
        let validFunction = validatorFunction(value);
        if(validFunction){
            switch(patterns){
                case 'required':
                    this.errors.push(validFunction);
                    this.addErrorModels(property, validFunction);
                    break;
                default:
                    if(value.toString().trim() != ''){
                        this.errors.push(validFunction);
                        this.addErrorModels(property, validFunction);
                    }
                    break;
            }
        }
    }

    addErrorModels(property, validFunction){
        for(let pattern in validFunction) {
            this.controls[property]['messages'].push(this.getErrorMessage(pattern, validFunction));
            this.controls[property]['validators'].push(validFunction);
        }
    }

    getErrorMessage(pattern, validFunction){
        let message = '';
        switch(pattern){
            case 'error':
                message = validFunction[pattern];
                break;
            case 'maxlength':
            case 'minlength':
                message = validation_messages[pattern].replace('{0}', validFunction[pattern]);
                break;
            default :
                message = validation_messages[pattern];
                break;
        }
        return message;
    }
}



