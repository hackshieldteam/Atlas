import { getRepository, Like } from 'typeorm';
import {CreateTrackingDto, FindTrackingDto, UpdateTrackingDto} from './tracking.dto';
import Tracking from '../../entities/tracking.entity';
import * as request from 'request'



class TrackingService {
    private trackingRepository = getRepository(Tracking)
    private jira_user : string = ''
    private jira_pass : string = ''
    private jira_path : string = ''

    public addTracking = async (trackingData: CreateTrackingDto) => {
        try {
            let url: string = this.jira_path + "/rest/api/2/issue/" 

            let issueData = {
                fields: {
                    "issuetype": {
                        name: "Historia"
                     },
                   project:
                   {
                      key: "HAC"
                   },
                   priority : {name: "Medium"},
                   summary: "Atlas_HAC: Altas_Endpoint Issue Creada",
                   description: "Creating of an issue using project keys and issue type names using the REST API",
               }
            };

            let options = {
                method : "POST",
                url : url,
                headers : { "Content-Type" : "application/json"},
                body : JSON.stringify(issueData)
            }

            console.log(issueData)
            request(options, (err, response, body) =>{
                if (err) {
                    return console.error('upload failed:', err);
                }
                else{
                    console.log(body);
                    let issue : Tracking;
                    issue.key = body.key
                    issue.jira_id = body.id,
                    issue.jira_path = body.self,
                    issue.status = 'OPEN'
                    // issue.vulnerability = trackingData.vulnerability        
                    const tracking = this.trackingRepository.save(issue);                                         }
            }).auth(this.jira_user, this.jira_pass, false);

        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Area already exist")
                default:
                    console.log(error)
                    throw new Error("Unknown error");
            }
        }
    }

    public getTracking = async (filters,relations) => {
        try {
            const tracking = await this.trackingRepository.findOne({where : filters, relations : relations});
            return (tracking);
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

    public findTrackings = async (filters: FindTrackingDto[], limit, offset) => {
        try {
            const trackings  = await this.trackingRepository.findAndCount({ where : filters, relations : ["vulnerability"]})
            return(trackings);
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

    public modifyTracking = async (id,trackingData : UpdateTrackingDto) => {
        try {
            
            var tracking : Tracking = await this.trackingRepository.findOne(id)
            if(tracking){
                let url: string = this.jira_path + "/rest/api/2/issue/" + tracking.key 
                let issueData = {
                    "fields": {
                       "project":
                       {
                          "key": "HAC"
                       },
                       "priority" : {"name": "Medium"},
                       "summary": "Atlas_HAC: Altas_Endpoint Issue Creada",
                       "description": "Creating of an issue using project keys and issue type names using the REST API",
                       "issuetype": {
                          "name": "Historia"
                       }
                   }
                };
                request.put({url: url, formData: issueData}, (err, httpResponse, body) =>{
                    if (err) {
                        return console.error('upload failed:', err);
                    }
                    else{
                        console.log(body);
                        let issue : Tracking;
                        issue.key = body.key
                        issue.jira_id = body.id,
                        issue.jira_path = body.self,
                        issue.status = 'OPEN'
                       // issue.vulnerability = trackingData.vulnerability        
                        //const updatedTracking = this.trackingRepository.save(Object.assign(tracking,trackingData));     
                    }
                }).auth(this.jira_user, this.jira_pass, false);
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

    public deleteTracking = async (id) => {
        try {
            const deletedTracking = await this.trackingRepository.delete(id);
            return(deletedTracking);            
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
}
export default TrackingService;
