import {getRepository} from 'typeorm';
import Jira from '../../entities/jira.entity';
import {RequestTokenJiraDto, AccessTokenJiraDto, UpdateJiraDto} from './jira.dto';
import HttpException from '../exceptions/HTTPException';
import {OAuth} from 'oauth';
import * as fs from 'fs';
import * as request from 'request';

class JiraService {
    public result: any;
    public result2: any;
    private jiraRepository = getRepository(Jira);
    private oauthRequest = {};
    public RequestTokenJira = async (jiraData: RequestTokenJiraDto) => {

        try {
            //Integration process
            //Get Unauthorized Token
            let consumer: OAuth = new OAuth(jiraData.homePath + "/plugins/servlet/oauth/request-token",
                jiraData.homePath + "/plugins/servlet/oauth/access-token",
                jiraData.consumerKey,
                jiraData.consumerPrivateKey,
                "1.0",
                jiraData.homePath + "",
                "RSA-SHA1",
            );
            //Get Access Token  
            await this.prueba(consumer, jiraData);

            return this.result2;

            //const jira = await this.jiraRepository.save(jiraData);
            //return(jira)
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error");
                case "23503":
                    throw new Error("Reference is missing");
                case "23505":
                    throw new Error("Area already exist");
                default:
                    throw new Error("Unknown error");
            }
        }
    };

    public prueba = async (consumer: OAuth, jiraData) => {
        consumer.getOAuthRequestToken(
            (error, oauthToken, oauthTokenSecret, results) => {
                if (error) {
                    //HAY QUE CONTROLAR EL ERROR
                } else {
                    let jira_auth_url = jiraData.homePath + "/plugins/servlet/oauth/authorize?oauth_token=" + oauthToken;
                    this.result2 = {'oauthToken': oauthToken, 'jira_auth_url': jira_auth_url};
                    return;
                }
            }
        );
    };

    public AccessTokenJira = async (jiraData: RequestTokenJiraDto) => {
        try {
            //Integration process
            //Get Unauthorized Token
            let consumer = new OAuth(jiraData.homePath + "/plugins/servlet/oauth/request-token",
                jiraData.homePath + "/plugins/servlet/oauth/access-token",
                jiraData.consumerKey,
                jiraData.consumerPrivateKey,
                "1.0",
                "http://localhost:8090/sessions/callback",
                "RSA-SHA1",
            );
            let oauthRequest = {};
            //Get Access Token
            async () => {
                await consumer.getOAuthRequestToken(
                    function(error, oauthToken, oauthTokenSecret, results) {
                        if (error) {
                            //HAY QUE CONTROLAR EL ERROR
                        } else {
                            let jira_auth_url = jiraData.homePath + "/plugins/servlet/oauth/authorize?oauth_token=" + oauthToken;
                            oauthRequest = {'oauthToken': oauthToken, 'jira_auth_url': jira_auth_url};
                        }
                    }
                );
            };

            return oauthRequest;
            //const jira = await this.jiraRepository.save(jiraData);
            //return(jira)
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error");
                case "23503":
                    throw new Error("Reference is missing");
                case "23505":
                    throw new Error("Area already exist");
                default:
                    throw new Error("Unknown error");
            }
        }
    };

    public getJira = async (filters, relations) => {
        try {
            const jira = await this.jiraRepository.findOne({where: filters, relations: relations});
            return (jira);
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error");
                case "23503":
                    throw new Error("Reference is missing");
                default:
                    throw new Error("Unknown error");
            }
        }
    };
    public deleteJira = async (id) => {
        try {
            const deletedJira = await this.jiraRepository.delete(id);
            return (deletedJira);
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error");
                default:
                    throw new Error("Unknown error");
            }
        }
    };
    public modifyJira = async (id, jiraData: UpdateJiraDto) => {
        try {
            let jira: Jira = await this.jiraRepository.findOne(id);
            if (jira) {
                const updatedJira = await this.jiraRepository.save(Object.assign(jira, jiraData));
                return (updatedJira);
            } else {
                return null;
            }
        } catch (error) {
            switch (error.code) {
                case "42601":
                    throw new Error("Syntax error");
                case "23505":
                    throw new Error("Company already exist");
                default:
                    throw new Error("Unknown error");
            }
        }
    };

}

export default JiraService;
