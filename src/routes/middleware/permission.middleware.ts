import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import InsufficientPermissionException from '../exceptions/InsufficientPermissionException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';




function hasPermissions(requiredFunctionalities : string[]){

  return (request,res,next) => {
    const cookies = request.cookies;
    const secret = process.env.JWT_SECRET;
    const verificationResponse = jwt.verify(request.header('xtoken'), secret) as DataStoredInToken;
    const tokenFuncionalities = verificationResponse.functionalities;
    const go : boolean = requiredFunctionalities.every( requiredFuncionality => tokenFuncionalities.indexOf(requiredFuncionality)!=-1);
    if(go){
      next()
    }else{
      next(new InsufficientPermissionException());
    }



  }
}

export default hasPermissions;