import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HTTPException';



function myValidate(type, elem) {
  return validate(plainToClass(type, elem), {
    whitelist: true,
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true
  })
    .then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints ? error.constraints : error.children[0].constraints ? error.children[0].constraints : { "error": "Wrong parameter" })).join(', ');
        return message
      }else{
        return(undefined)
      }
    });
};


function validationMiddleware<T>(type: any): express.RequestHandler {
var wrong : boolean = true
var errors = []
  return (req, res, next) => {
   // try {
      if (Array.isArray(req.body)) {
        var i = 0;
        for(i=0;i<req.body.length;i++){
          myValidate(type, req.body[i]).then((err) => {
            if(err){
              wrong = false;
              errors.push(err)
              //next(new HttpException(400, err))
            }
          })
        }
        if(errors.length>0){
          console.log(errors)
          next(new HttpException(400, errors[0]))
        }else{
          next()
        }
      } else {
        myValidate(type, req.body).then((err) => {
          if(err){
            next(new HttpException(400, err))
          }else{
            next()
          }
        })
      }
    //} catch (error) {
    //  next(new HttpException(400, error.message));
    //}
  }
}

export default validationMiddleware;
