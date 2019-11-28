import { getRepository } from 'typeorm';
import Jira from './jira.entity';
import { CreateJiraDto, UpdateJiraDto } from '../jira/jira.dto';
import HttpException from '../exceptions/HTTPException';
import {OAuth} from 'oauth';
import * as fs from 'fs';
import * as request from 'request'

class JiraService {

    private jiraRepository = getRepository(Jira)
    public getJiraOauthRequest = async (jiraData : CreateJiraDto ) => {
        try {
            console.log("/n/n/n/n/n/nllego hasta aqui8")
            //Integration process
            //Get Unauthorized Token
            console.log(jiraData.homePath,jiraData.consumerKey,jiraData.consumerPrivateKey);
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
                        console.log("/n/n/n/n/n/nllego hasta aqui9")
                        console.log(error.data);
                        //HAY QUE CONTROLAR EL ERROR
                    }
                    else {
                        console.log("/n/n/n/n/n/nllego hasta aqui10")
                        console.log(oauthToken, oauthTokenSecret)
                        var jira_auth_url = jiraData.homePath + "/plugins/servlet/oauth/authorize?oauth_token=" + oauthToken
                        console.log({'oauthToken': oauthToken,'oauthTokenSecret': oauthTokenSecret, 'jira_auth_url': jira_auth_url})
                        oauthRequest= {'oauthToken': oauthToken,'oauthTokenSecret': oauthTokenSecret, 'jira_auth_url': jira_auth_url}
                    }
                }
            )}

            console.log("/n/n/n/n/n/nllego hasta aqui11")
            console.log(oauthRequest)
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
