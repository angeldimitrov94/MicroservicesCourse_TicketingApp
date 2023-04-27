import {ValidationError} from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');
        //only because we are extending a built-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        const formattedErrors = this.errors.map(error => {
                const message = error.msg as string;

                if (error.type === 'alternative') {
                    return { message: message };
                } else if (error.type === 'field') {
                    return { message: message , field: error.path };
                } else {
                    return { message: "n/a" };
                }
            }
        )

        return formattedErrors;
    }
}