class ExpressError extends Error{
    constructor(statusCode,maessage){
        super();
        this.statusCode =statusCode;
        this.message =this.message;
    }
}
module.exports = ExpressError;