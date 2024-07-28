const messages = require('./language');

const handleException = (error, res)=>{

    console.log(error);

    let statusCode = 500;
    let errorMessage = messages.INTERNAL_SERVER_ERROR;

    if(error.name === 'validationError')
    {
        statusCode = 400;
        errorMessage =  formatValidationError(error);
    }
    else if(error.name === 'castError' && error.kind === 'ObjectId' )
    {
        statusCode = 404;
        errorMessage =  messages.RESOURCE_NOT_FOUND;
    }


    res.status(statusCode).json({
        status: 'error',
        message: errorMessage
      })

      const formatValidationError = (error)=>{
        const errors = Object.values(error.errors).map((e)=> e.message);
        return errors.join(", ");

      }

}

module.exports= handleException;