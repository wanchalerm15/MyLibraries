'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Developer by wanchaloem laokeut [ ttvone ] from addlink company @2016 */

// Message validate
var validation_messages = {
    required: 'The field is required.',
    pattern: 'The field is invalid.',
    email: 'The field is email.',
    password: 'The field is password.',
    maxlength: 'The field is maximum {0}.',
    minlength: 'The field is minimum {0}.',
    special_characters: 'The field is special characters.'
};
// Patterns validate

var validators = function () {
    function validators() {
        _classCallCheck(this, validators);
    }

    _createClass(validators, null, [{
        key: 'required',
        value: function required(value) {
            if (value.toString().trim() == '') {
                return { required: '' };
            }
            return;
        }
    }, {
        key: 'email',
        value: function email(value) {
            if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
                return { email: '' };
            }
            return;
        }
    }, {
        key: 'password',
        value: function password(value) {
            if (!/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*-_]{8,20}$/.test(value)) {
                return { password: '' };
            }
            return;
        }
    }, {
        key: 'special_characters',
        value: function special_characters(value) {
            if (!/^((?!([~`!#$%\^&*+=\[\]\\';,/{}|\\"":<>\?@])).)+$/.test(value)) {
                return { special_characters: '' };
            }
            return;
        }
    }, {
        key: 'pattern',
        value: function pattern(_pattern) {
            return function (value) {
                if (!_pattern.test(value)) {
                    return { pattern: _pattern };
                }
                return;
            };
        }
    }, {
        key: 'maxlength',
        value: function maxlength(length) {
            return function (value) {
                if (value.length > length) {
                    return { maxlength: length };
                }
                return;
            };
        }
    }, {
        key: 'minlength',
        value: function minlength(length) {
            return function (value) {
                if (value.length < length) {
                    return { minlength: length };
                }
                return;
            };
        }
    }]);

    return validators;
}();

;
// Class validate

var validationModel = function () {
    function validationModel(model) {
        var validateFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, validationModel);

        // private variable
        this.model = this.hasModel(model);
        this._validateFields = validateFields;
        // public variable
        this.controls = {};
        this.errors = [];
        this.validateValid();
        this.valid = this.errors.length == 0;
        this.invalid = this.errors.length > 0;
        this.value = this.model;
        this.fields = function () {
            var field = this.validateFields();
            var fields = [];
            for (var i in field) {
                fields.push(i);
            }return fields;
        }.call(this);
        this.messages = function () {
            var _this = this;

            var messages = [];
            this.errors.forEach(function (error) {
                for (var property in error) {
                    messages.push(_this.getErrorMessage(property, error));
                }
            });
            return messages;
        }.call(this);
        // delete variable
        delete this.model;
        delete this.validateFields;
        delete this.validateValid;
        delete this.hasModel;
        delete this.addError;
        delete this.addErrorModels;
        delete this._validateFields;
    }

    _createClass(validationModel, [{
        key: 'validateFields',
        value: function validateFields() {
            return {};
        }
    }, {
        key: 'validateValid',
        value: function validateValid() {
            // check custom fields
            var hasFields = false;
            for (var i in this._validateFields) {
                hasFields = true;
            } // constan variable
            var model = this.hasModel(this.model);
            var field = hasFields ? this._validateFields : this.validateFields();
            // find variable
            for (var variable in field) {
                // find property
                for (var property in model) {
                    // check property equals variable
                    if (property === variable) {
                        // for the models
                        this.controls[property] = {
                            messages: [],
                            validators: [],
                            value: model[property],
                            valid: null,
                            invalid: null
                        };
                        // check value must not object
                        if (_typeof(model[property]) == 'object') return;
                        // set functions
                        var validator = field[variable];
                        // set value
                        var value = model[property];
                        // find functions
                        for (var _i in validator) {
                            var validatorFunction = validator[_i];
                            this.addError(validatorFunction, validatorFunction.name, property, value);
                        }
                    }
                }
            }
            // modify controls change valid and invalid 
            for (var prop in this.controls) {
                var _variable = this.controls[prop];
                this.controls[prop].valid = this.controls[prop].messages.length == 0;
                this.controls[prop].invalid = this.controls[prop].messages.length > 0;
            }
        }
    }, {
        key: 'hasModel',
        value: function hasModel(model) {
            if (!model) throw 'ValidationModel class is Error [ please input model in class ]';
            return model;
        }
    }, {
        key: 'addError',
        value: function addError(validatorFunction, patterns, property, value) {
            var validFunction = validatorFunction(value);
            if (validFunction) {
                switch (patterns) {
                    case 'required':
                        this.errors.push(validFunction);
                        this.addErrorModels(property, validFunction);
                        break;
                    default:
                        if (value.toString().trim() != '') {
                            this.errors.push(validFunction);
                            this.addErrorModels(property, validFunction);
                        }
                        break;
                }
            }
        }
    }, {
        key: 'addErrorModels',
        value: function addErrorModels(property, validFunction) {
            for (var pattern in validFunction) {
                this.controls[property]['messages'].push(this.getErrorMessage(pattern, validFunction));
                this.controls[property]['validators'].push(validFunction);
            }
        }
    }, {
        key: 'getErrorMessage',
        value: function getErrorMessage(pattern, validFunction) {
            var message = '';
            switch (pattern) {
                case 'error':
                    message = validFunction[pattern];
                    break;
                case 'maxlength':
                case 'minlength':
                    message = validation_messages[pattern].replace('{0}', validFunction[pattern]);
                    break;
                default:
                    message = validation_messages[pattern];
                    break;
            }
            return message;
        }
    }]);

    return validationModel;
}();