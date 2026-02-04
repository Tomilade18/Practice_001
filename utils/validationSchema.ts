export const validationSchema = {
    userName: {
        isString: {
            errorMessage: "Must be a string"
        },
        notEmpty: {
            errorMessage: "Cannot be empty"
        },
        isLength: {
            options:{
                min: 5,
                max: 32,
            },
            errorMessage: "Number of characters Should be between 5 and 32"
        }
    },
    displayName: {
        isString: {
            errorMessage: "Must be a string"
        },
        notEmpty: true,
        isLength: {
            options:{
                min: 5,
                max: 32,
            },
            errorMessage: "Number of characters Should be between 5 and 32"
        }
    },
}