import { getRepository } from 'typeorm';
import Jira from './jira.entity';
import { OauthTokenJiraDto,AccessTokenJiraDto, UpdateJiraDto } from '../jira/jira.dto';
import HttpException from '../exceptions/HTTPException';
import {OAuth} from 'oauth';
import * as fs from 'fs';
import * as request from 'request'

class JiraService {
    public result: any;
    public result2: any;
    private jiraRepository = getRepository(Jira)
    private oauthRequest = {}
    public OauthTokenJira = async (jiraData : OauthTokenJiraDto ) => {
        
        try {
            //Integration process
            //Get Unauthorized Token
            let consumer: OAuth = new OAuth(jiraData.homePath + "/plugins/servlet/oauth/request-token",
                jiraData.homePath + "/plugins/servlet/oauth/access-token",
                jiraData.consumerKey,
                jiraData.consumerPrivateKey,
                "1.0",
                "http://localhost:8090/sessions/callback",
                "RSA-SHA1",
            );
            //Get Access Token  
           await this.prueba(consumer, jiraData);
            
            console.log(`El resultado es: ${this.result2}`)
            return this.result2;
            
            //const jira = await this.jiraRepository.save(jiraData);
            //return(jira)
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Area already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public prueba = async (consumer: OAuth, jiraData) => {
        consumer.getOAuthRequestToken(
            (error, oauthToken, oauthTokenSecret, results) => {
                if (error) {
                    console.log(error.data);
                    //HAY QUE CONTROLAR EL ERROR
                }
                else {
                    var jira_auth_url = jiraData.homePath + "/plugins/servlet/oauth/authorize?oauth_token=" + oauthToken
                    console.log({'oauthToken': oauthToken,'oauthTokenSecret': oauthTokenSecret, 'jira_auth_url': jira_auth_url})
                    this.result2 =  {'oauthToken': oauthToken,'jira_auth_url': jira_auth_url}
                    return;
                }
            }
        )
    }

    public AccessTokenJira = async (jiraData : OauthTokenJiraDto ) => {
        try {
            //Integration process
            //Get Unauthorized Token
            var consumer =   new OAuth(jiraData.homePath + "/plugins/servlet/oauth/request-token",
                jiraData.homePath + "/plugins/servlet/oauth/access-token",
                jiraData.consumerKey,
                jiraData.consumerPrivateKey,
                "1.0",
                "http://localhost:8090/sessions/callback",
                "RSA-SHA1",
            );
            var oauthRequest = {}
            //Get Access Token
            async ()=> {
                await consumer.getOAuthRequestToken(
                function(error, oauthToken, oauthTokenSecret, results) {
                    if (error) {
                        console.log(error.data);
                        //HAY QUE CONTROLAR EL ERROR
                    }
                    else {
                        var jira_auth_url = jiraData.homePath + "/plugins/servlet/oauth/authorize?oauth_token=" + oauthToken
                        console.log({'oauthToken': oauthToken,'oauthTokenSecret': oauthTokenSecret, 'jira_auth_url': jira_auth_url})
                        oauthRequest= {'oauthToken': oauthToken,'jira_auth_url': jira_auth_url}
                    }
                }
            )}

            return oauthRequest;
            //const jira = await this.jiraRepository.save(jiraData);
            //return(jira)
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Area already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getJira = async (filters,relations) => {
        try {
            const jira = await this.jiraRepository.findOne({where : filters, relations : relations});
            return (jira);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public deleteJira = async (id) => {
        try {
            const deletedJira = await this.jiraRepository.delete(id);
            return(deletedJira);            
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public modifyJira = async (id,jiraData : UpdateJiraDto) => {
        try {
            var jira : Jira = await this.jiraRepository.findOne(id)
            if(jira){
                const updatedJira = await this.jiraRepository.save(Object.assign(jira,jiraData));
                return(updatedJira)
            }else{
                return(null)
            }
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23505":
                    throw new Error("Company already exist")
                default:
                    console.log(error)
                    throw new Error("Unknown error");
            }
        }
    }

}

export default JiraService;
