/* Developer by wanchaloem laokeut [ ttvone ] from addlink company @2016 version 1.10.2 */

// Message validate
const validation_messages = {
    required: 'The field "{0}" is required.',
    pattern: 'The field "{0}" is invalid.',
    email: 'The field "{0}" is email.',
    password: 'The field "{0}" is password.',
    maxlength: 'The field "{0}" is maximum {0}.',
    minlength: 'The field "{0}" is minimum {0}.',
    special_characters: 'The field "{0}" is special characters.',
    notfound_field: 'The validate field "{0}" not found.'
};
// Patterns validate
class validators {
    static required(value) {
        if (value === null || value === undefined) return { required: '' }
        if (value.toString().trim() == '') return { required: '' }
        return;
    }
    static email(value) {
        if (!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(value)) { return { email: '' }; }
        return;
    }
    static password(value) {
        if (!(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*-_]{8,20}$/).test(value)) { return { password: '' }; }
        return;
    }
    static special_characters(value) {
        if (!(/^((?!([~`!#$%\^&*+=\[\]\\';,/{}|\\"":<>\?@])).)+$/).test(value)) { return { special_characters: '' }; }
        return;
    }
    static pattern(pattern) {
        return (value) => {
            if (!pattern.test(value)) { return { pattern: pattern }; }
            return;
        };
    }
    static maxlength(length) {
        return (value) => {
            if (value.length > length) { return { maxlength: length }; }
            return;
        }
    }
    static minlength(length) {
        return (value) => {
            if (value.length < length) { return { minlength: length }; }
            return;
        }
    }
};
// Class validate
class validationModel {

    constructor(model, validateFields = {}) {
        // private variable
        this.model = this.hasModel(model);
        this._validateFields = validateFields;
        this._similarField = [];
        this._nullValidationField = true;
        // public variable
        this.controls = {};
        this.errors = [];
        this.validateValid();
        this.valid = (this.errors.length == 0 && this._similarField.length > 0) || this._nullValidationField;
        this.invalid = !this.valid;
        this.value = this.model;
        this.fields = (function() {
            let field = this.validateFields();
            let fields = [];
            for (let i in field)
                fields.push(i);
            return fields;
        }).call(this);
        this.messages = (function() {
            var messages = [];
            this.errors.forEach(error => {
                // update new  27-01-2017 by loem show the name of field
                for (let property in error.validators) {
                    let message = this.getErrorMessage(property, error.validators, error.property);
                    if (messages.indexOf(message) == -1)
                        messages.push(message);
                }
            });
            // clear validation message if similar
            return messages;
        }).call(this);
        // delete variable
        delete this.model;
        delete this.validateFields;
        delete this.validateValid;
        delete this.hasModel;
        delete this.addError;
        delete this.addErrorModels;
        delete this._validateFields;
    }

    validateFields() {
        return {};
    }

    validateValid() {
        // check custom fields
        let hasFields = false;
        let similarField = this._similarField; // update new  27-01-2017 by loem check not similar of field
        for (let i in this._validateFields) { hasFields = true; break; }
        // constan variable
        const model = this.hasModel(this.model);
        const field = hasFields ? this._validateFields : this.validateFields();
        // find variable
        for (let variable in field) {
            // find property
            for (let property in model) {
                // check property equals variable
                if (property === variable) {
                    // set value of filed to similarField
                    similarField.push(variable);
                    // for the models
                    this.controls[property] = {
                        messages: [],
                        validators: [],
                        value: model[property],
                        valid: null,
                        invalid: null
                    };
                    // check value must not object
                    // update new 28-01-2017 by loem continue null and undefined
                    if (typeof model[property] == 'object' && model[property] !== null && model[property] !== undefined) return;
                    // set functions
                    let validator = field[variable];
                    // set value
                    let value = model[property];
                    // find functions
                    for (let i in validator) {
                        let validatorFunction = validator[i];
                        this.addError(validatorFunction, validatorFunction.name, property, value);
                    }
                }
            }
        }
        // modify controls change valid and invalid 
        for (let prop in this.controls) {
            let variable = this.controls[prop];
            this.controls[prop].valid = this.controls[prop].messages.length == 0;
            this.controls[prop].invalid = !this.controls[prop].valid;
        }
        // update new  27-01-2017 by loem check not found of validate fields again
        for (let variable in field) {
            if (this._similarField.indexOf(variable) == -1) {
                this.controls[variable] = {
                    messages: [],
                    validators: [],
                    value: model[variable] || null,
                    valid: false,
                    invalid: true
                };
                let validatorsError = {
                    property: variable,
                    validators: { notfound_field: '' }
                };
                this.errors.push(validatorsError);
                this.addErrorModels(variable, validatorsError);
            }
        }
        // update new 28-01-2017 by loem check null of field
        for (let field in this._validateFields) {
            this._nullValidationField = false;
        }
    }

    hasModel(model) {
        if (!model) throw ('ValidationModel class is Error [ please input model in class ]');
        return model;
    }

    addError(validatorFunction, patterns, property, value) {
        let validFunction = validatorFunction(value);
        if (validFunction) {
            switch (patterns) {
                case 'required':
                    // update new  27-01-2017 by loem add new property to validate error
                    let validatorsError = { property, validators: validFunction };
                    this.errors.push(validatorsError);
                    this.addErrorModels(property, validatorsError);
                    break;
                default:
                    if (value === undefined || value === null) value = '';
                    if (value.toString().trim() != '') {
                        // update new  27-01-2017 by loem
                        let validatorsError = { property, validators: validFunction };
                        this.errors.push(validatorsError);
                        this.addErrorModels(property, validatorsError);
                    }
                    break;
            }
        }
    }

    addErrorModels(property, validFunction) {
        let validators = validFunction.validators;
        for (let pattern in validators) {
            // update new  27-01-2017 by loem
            this.controls[property]['messages'].push(this.getErrorMessage(pattern, validators, property));
            this.controls[property]['validators'].push(validators);
        }
    }

    getErrorMessage(pattern, validFunction, property) {
        // update new  27-01-2017 by loem
        let message = '';
        let validators = validFunction.validators;
        switch (pattern) {
            case 'error':
                message = validators[pattern];
                break;
            case 'maxlength':
            case 'minlength':
                message = validation_messages[pattern].replace('{0}', validators[pattern]);
                break;
            default:
                message = validation_messages[pattern];
                break;
        }
        return message.replace("{0}", property);
    }
}

exports.validators = validators;
exports.validationModel = validationModel;
