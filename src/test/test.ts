import * as typeorm from 'typeorm';
import 'dotenv/config';
import App from "../app";
import config from './ormconfig';
import { createConnection } from 'typeorm';
import CompanyController from '../routes/companies/company.controller';
import AuthenticationController from '../routes/authentication/authentication.controller';
import UserController from '../routes/users/user.controller';
import ProfileController from '../routes/profiles/profile.controller';
import * as request from 'supertest';
import validateEnv from '../utils/validateEnv'
import { equal, fail } from 'assert';
import * as bcrypt from 'bcrypt';
import User from '../entities/user.entity';
import GroupController from '../routes/groups/group.controller';
import AreaController from '../routes/areas/area.controller';
import AssetController from '../routes/assets/asset.controller';
import DepartmentController from '../routes/departments/department.controller';
import AuditController from '../routes/audits/audit.controller';
import IntegrationController from '../routes/integrations/integration.controller';
import ResponsableController from '../routes/responsables/responsable.controller';
import TagController from '../routes/tags/tag.controller';
import UrlController from '../routes/urls/url.controller';
import VulnerabilityController from '../routes/vulnerabilities/vulnerability.controller';
import { VulnerabilityStatus, EvidenceClass } from '../utils/constants';
import EvidenceController from '../routes/evidences/evidence.controller';

import * as fs from 'fs';
import MethodologyController from '../routes/methodologies/methodology.controller';
import Test from 'entities/test.entity';
import KnowledgeBaseController from '../routes/knowledgeBase/knowledgeBase.controller';
import JiraController from '../routes/jira/jira.controller';


validateEnv();


describe('Atlas endpoints', () => {

    let entityManager;
    let app;
    let token;
    let tokenWithoutPermissions;
    let tokenCompany2;
    let tokenVuln;
    let connection;

    before(async function () {
        this.timeout(10000);
        try {
            connection = await createConnection(config);
            entityManager = await typeorm.getManager();
            //Companies
            await Promise.all([
                entityManager.query('INSERT INTO t_company ("id","name","description") VALUES (1,\'C1\',\'Company1\')'),
                entityManager.query('INSERT INTO t_company ("id","name","description") VALUES (2,\'NeoCompany\',\'C2\')'),
                entityManager.query('INSERT INTO t_company ("id","name","description") VALUES (3,\'ModCompany\',\'C3\')'),
                entityManager.query('INSERT INTO t_company ("id","name","description") VALUES (4,\'DelCompany\',\'C4\')'),
                entityManager.query('INSERT INTO t_company ("id","name","description") VALUES (5,\'C5\',\'Company5\')'),
                entityManager.query('INSERT INTO t_profile("id","name") VALUES (1,\'Profile1\')'),
                entityManager.query('INSERT INTO t_profile("id","name") VALUES (2,\'Profile2\')'),
                entityManager.query('INSERT INTO t_profile("id","name") VALUES (3,\'ModProfile\')'),
                entityManager.query('INSERT INTO t_profile("id","name") VALUES (4,\'DelProfile\')'),
                entityManager.query('INSERT INTO t_profile("id","name") VALUES (5,\'VulnProfile\')'),


                entityManager.query('INSERT INTO t_knowledge_base("id","name","category","content") VALUES (1,\'XSS\',\'description\',\'Cross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user. Flaws that allow these attacks to succeed are quite widespread and occur anywhere a web application uses input from a user within the output it generates without validating or encoding it.\')'),
                entityManager.query('INSERT INTO t_knowledge_base("id","name","category","content") VALUES (2,\'SQL Injection\',\'description\',\'SQL injection usually occurs when you ask a user for input, like their username/userid, and instead of a name/id, the user gives you an SQL statement that you will unknowingly run on your database.\')'),
                entityManager.query('INSERT INTO t_knowledge_base("id","name","category","content") VALUES (3,\'SQL Injection(PHP)\',\'solution\',\'To protect a web site from SQL injection, you can use SQL parameters.\')'),
                entityManager.query('INSERT INTO t_knowledge_base("id","name","category","content") VALUES (4,\'XSS (Angular)\',\'solution\',\'Do NOT simply escape the list of example characters provided in the various rules. It is NOT sufficient to escape only that list. Blacklist approaches are quite fragile. The whitelist rules here have been carefully designed to provide protection even against future vulnerabilities introduced by browser changes.\')'),
                entityManager.query('INSERT INTO t_knowledge_base("id","name","category","content") VALUES (5,\'CORS\',\'description\',\'El intercambio de recursos de origen cruzado o CORS (Cross-origin resource sharing, en sus siglas en inglés) es un mecanismo que permite que se puedan solicitar recursos restringidos (como por ejemplo, las tipografías) en una página web desde un dominio fuera del dominio que sirvió el primer recurso.\')'),
                
            ]);

            //Areas
            await Promise.all([
                entityManager.query('INSERT INTO t_area ("id","name","companyId") VALUES (1,\'Area1\',1)'),
                entityManager.query('INSERT INTO t_area ("id","name","companyId") VALUES (2,\'Area2\',1)'),
                entityManager.query('INSERT INTO t_area ("id","name","companyId") VALUES (3,\'ModArea\',1)'),
                entityManager.query('INSERT INTO t_area ("id","name","companyId") VALUES (4,\'DelArea\',1)'),
                entityManager.query('INSERT INTO t_area ("id","name","companyId") VALUES (5,\'Area5\',5)'),
                entityManager.query('INSERT INTO t_user ("id","name","password","profileId")  VALUES (1,\'User1\',\'$2b$10$9tblbSiNZVrZ5f904cwQxeZXo4OaQpbnnYkoB2qen7XwJHNAKuJe.\',1)'),
                entityManager.query('INSERT INTO t_user ("id","name","password","profileId")  VALUES (2,\'User2\',\'$2b$10$9tblbSiNZVrZ5f904cwQxeZXo4OaQpbnnYkoB2qen7XwJHNAKuJe.\',2)'),
                entityManager.query('INSERT INTO t_user ("id","name","password","profileId")  VALUES (3,\'ModUser\',\'c\',1)'),
                entityManager.query('INSERT INTO t_user ("id","name","password","profileId")  VALUES (4,\'DelUser\',\'c\',1)'),
                entityManager.query('INSERT INTO t_user ("id","name","password","profileId")  VALUES (5,\'User5\',\'$2b$10$9tblbSiNZVrZ5f904cwQxeZXo4OaQpbnnYkoB2qen7XwJHNAKuJe.\',2)'),
                entityManager.query('INSERT INTO t_user ("id","name","password","profileId")  VALUES (6,\'User6\',\'$2b$10$9tblbSiNZVrZ5f904cwQxeZXo4OaQpbnnYkoB2qen7XwJHNAKuJe.\',1)'),
                entityManager.query('INSERT INTO t_user ("id","name","password","profileId")  VALUES (7,\'User7\',\'$2b$10$9tblbSiNZVrZ5f904cwQxeZXo4OaQpbnnYkoB2qen7XwJHNAKuJe.\',5)'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET COMPANIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD COMPANIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY COMPANIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE COMPANIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET PROFILES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD PROFILES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY PROFILES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE PROFILES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET GROUPS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD GROUPS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY GROUPS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE GROUPS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET USERS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD USERS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY USERS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE USERS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET AREAS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD AREAS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY AREAS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE AREAS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET ASSETS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD ASSETS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY ASSETS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE ASSETS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET DEPARTMENTS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD DEPARTMENTS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY DEPARTMENTS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE DEPARTMENTS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET AUDITS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD AUDITS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY AUDITS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE AUDITS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET TAGS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD TAGS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY TAGS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE TAGS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET INTEGRATIONS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD INTEGRATIONS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY INTEGRATIONS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE INTEGRATIONS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET URLS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD URLS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY URLS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE URLS\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET EVIDENCES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD EVIDENCES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY EVIDENCES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE EVIDENCES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'GET VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ADD VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'MODIFY VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'DELETE VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'CLOSE VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'ASSUME VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'FALSEPOSITIVE VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'OPEN VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_functionality("name") VALUES (\'REVISION VULNERABILITIES\')'),
                entityManager.query("INSERT INTO t_functionality(name) VALUES ('GET METHODOLOGIES')"),
                entityManager.query("INSERT INTO t_functionality(name) VALUES ('ADD METHODOLOGIES')"),
                entityManager.query("INSERT INTO t_functionality(name) VALUES ('MODIFY METHODOLOGIES')"),
                entityManager.query("INSERT INTO t_functionality(name) VALUES ('DELETE METHODOLOGIES')"),
                entityManager.query("INSERT INTO t_functionality(name) VALUES ('GET KNOWLEDGE')"),
                entityManager.query("INSERT INTO t_functionality(name) VALUES ('ADD KNOWLEDGE')"),
                entityManager.query("INSERT INTO t_functionality(name) VALUES ('MODIFY KNOWLEDGE')"),
                entityManager.query("INSERT INTO t_functionality(name) VALUES ('DELETE KNOWLEDGE')"),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET COMPANIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD COMPANIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY COMPANIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE COMPANIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET PROFILES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD PROFILES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY PROFILES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE PROFILES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET GROUPS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD GROUPS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY GROUPS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE GROUPS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET USERS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD USERS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY USERS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE USERS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET AREAS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD AREAS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY AREAS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE AREAS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET ASSETS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD ASSETS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY ASSETS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE ASSETS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET DEPARTMENTS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD DEPARTMENTS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY DEPARTMENTS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE DEPARTMENTS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET AUDITS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD AUDITS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY AUDITS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE AUDITS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET TAGS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD TAGS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY TAGS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE TAGS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET INTEGRATIONS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD INTEGRATIONS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY INTEGRATIONS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE INTEGRATIONS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET EVIDENCES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD EVIDENCES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY EVIDENCES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE EVIDENCES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET URLS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD URLS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY URLS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE URLS\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'OPEN VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'CLOSE VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'REVISION VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'FALSEPOSITIVE VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ASSUME VULNERABILITIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (5,\'MODIFY VULNERABILITIES\')'),


                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET METHODOLOGIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD METHODOLOGIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY METHODOLOGIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE METHODOLOGIES\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET KNOWLEDGE\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD KNOWLEDGE\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY KNOWLEDGE\')'),
                entityManager.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE KNOWLEDGE\')'),
                
                entityManager.query('INSERT INTO t_responsable ("id","email","name","tlf","companyId") VALUES (1,\'r1@mail.com\',\'Resp1\',\'611111111\',1)'),
                entityManager.query('INSERT INTO t_responsable ("id","email","name","tlf","companyId") VALUES (2,\'r2@mail.com\',\'Resp2\',\'622222222\',1)'),
                entityManager.query('INSERT INTO t_responsable ("id","email","name","tlf","companyId") VALUES (3,\'r3@mail.com\',\'Resp3\',\'633333333\',1)'),
                entityManager.query('INSERT INTO t_responsable ("id","email","name","tlf","companyId") VALUES (4,\'r4@mail.com\',\'Resp4\',\'644444444\',1)'),
                entityManager.query('INSERT INTO t_responsable ("id","email","name","tlf","companyId") VALUES (5,\'r5@mail.com\',\'Resp5\',\'655555555\',5)'),
                entityManager.query('INSERT INTO t_methodology ("id","description","name","companyId") VALUES (1,\'D1\',\'Methodology1\',1)'),
                entityManager.query('INSERT INTO t_methodology ("id","description","name","companyId") VALUES (2,\'D2\',\'NeoMethodology\',1)'),
                entityManager.query('INSERT INTO t_methodology ("id","description","name","companyId") VALUES (3,\'D3\',\'ModMethodology\',1)'),
                entityManager.query('INSERT INTO t_methodology ("id","description","name","companyId") VALUES (4,\'D4\',\'DelMethodology\',1)'),
                entityManager.query('INSERT INTO t_methodology ("id","description","name","companyId") VALUES (5,\'D5\',\'Methodology5\',5)'),



            ]);

            //Departments
            await Promise.all([
                entityManager.query('INSERT INTO t_department ("id","name","areaId","companyId") VALUES (1,\'Department1\',1,1)'),
                entityManager.query('INSERT INTO t_department ("id","name","areaId","companyId") VALUES (2,\'NeoDepartment\',1,1)'),
                entityManager.query('INSERT INTO t_department ("id","name","areaId","companyId") VALUES (3,\'ModDepartment\',1,1)'),
                entityManager.query('INSERT INTO t_department ("id","name","areaId","companyId") VALUES (4,\'DelDepartment\',1,1)'),
                entityManager.query('INSERT INTO t_department ("id","name","areaId","companyId") VALUES (5,\'Department5\',5,5)')
            ]);

            //Assets
            await Promise.all([
                entityManager.query('INSERT INTO t_asset ("id","alias","authentication","authorization","availability","class","confidenciality","description","enviroment","hgf","integrity","name","status","statusDate","trazability","visibility","volumetry","businessAreaId","companyId","departmentId") VALUES (1,\'A1\',0,3,3,0,3,\'My first asset\',0,\'hgf1\',3,\'Asset 1\',0,\'2019-09-01\',3,0,100,1,1,1)'),
                entityManager.query('INSERT INTO t_asset ("id","alias","authentication","authorization","availability","class","confidenciality","description","enviroment","hgf","integrity","name","status","statusDate","trazability","visibility","volumetry","businessAreaId","companyId","departmentId") VALUES (2,\'NA\',0,3,3,0,3,\'NeoAsset\',0,\'hgf2\',3,\'Asset 2\',0,\'2019-09-01\',3,0,100,1,1,1)'),
                entityManager.query('INSERT INTO t_asset ("id","alias","authentication","authorization","availability","class","confidenciality","description","enviroment","hgf","integrity","name","status","statusDate","trazability","visibility","volumetry","businessAreaId","companyId","departmentId") VALUES (3,\'MA\',0,3,3,0,3,\'ModAsset\',0,\'hg3\',3,\'Asset 3\',0,\'2019-09-01\',3,0,100,1,1,1)'),
                entityManager.query('INSERT INTO t_asset ("id","alias","authentication","authorization","availability","class","confidenciality","description","enviroment","hgf","integrity","name","status","statusDate","trazability","visibility","volumetry","businessAreaId","companyId","departmentId") VALUES (4,\'DA\',0,3,3,0,3,\'DelAsset\',0,\'hgf4\',3,\'Asset 4\',0,\'2019-09-01\',3,0,100,1,1,1)'),
                entityManager.query('INSERT INTO t_asset ("id","alias","authentication","authorization","availability","class","confidenciality","description","enviroment","hgf","integrity","name","status","statusDate","trazability","visibility","volumetry","businessAreaId","companyId","departmentId") VALUES (5,\'A2\',1,2,2,1,2,\'My second asset\',1,\'hgf5\',2,\'Asset 5\',1,\'2020-01-01\',3,0,92,5,5,5)'),
            ]);

            //URLs
            await Promise.all([
                entityManager.query('INSERT INTO t_url ("id","kind","enviroment","port","url","assetId","companyId") VALUES (1,0,\'Production\',80,\'www.asset1.com\',1,1)'),
                entityManager.query('INSERT INTO t_url ("id","kind","enviroment","port","url","assetId","companyId") VALUES (2,0,\'Pre\',80,\'www.newasset1.com\',1,1)'),
                entityManager.query('INSERT INTO t_url ("id","kind","enviroment","port","url","assetId","companyId") VALUES (3,0,\'Production\',80,\'www.modasset1.com\',1,1)'),
                entityManager.query('INSERT INTO t_url ("id","kind","enviroment","port","url","assetId","companyId") VALUES (4,0,\'Production\',80,\'www.delasset.com\',1,1)'),
                entityManager.query('INSERT INTO t_url ("id","kind","enviroment","port","url","assetId","companyId") VALUES (5,1,\'Pre\',443,\'www.pre-asset5.com\',5,5)')
            ]);

            //Audits
            await Promise.all([
                entityManager.query('INSERT INTO t_audit ("id","kind","delivered","launched","methodology","notes","name","risk","scheduled","status","tool","assetId","urlId","companyId") VALUES (1,\'Audit\',0,NULL,0,\'My first audit\',\'Audit1\',1,\'2019-12-12\',0,\'Acunetix\',1,1,1)'),
                entityManager.query('INSERT INTO t_audit ("id","kind","delivered","launched","methodology","notes","name","risk","scheduled","status","tool","assetId","urlId","companyId") VALUES (2,\'Revision\',0,\'2017-01-01\',1,\'NULL\',\'NeoAudit\',0,NULL,1,\'Acunetix\',1,1,1)'),
                entityManager.query('INSERT INTO t_audit ("id","kind","delivered","launched","methodology","notes","name","risk","scheduled","status","tool","assetId","urlId","companyId") VALUES (3,\'Audit\',0,\'2017-06-06\',1,\'NULL\',\'ModAudit\',0,NULL,1,\'Acunetix\',1,1,1)'),
                entityManager.query('INSERT INTO t_audit ("id","kind","delivered","launched","methodology","notes","name","risk","scheduled","status","tool","assetId","urlId","companyId") VALUES (4,\'Pentest\',0,\'2018-09-09\',1,\'NULL\',\'DelAudit\',0,NULL,1,\'Acunetix\',1,1,1)'),
                entityManager.query('INSERT INTO t_audit ("id","kind","delivered","launched","methodology","notes","name","risk","scheduled","status","tool","assetId","urlId","companyId") VALUES (5,\'Audit\',1,NULL,0,\'\',\'Audit5\',0,NULL,0,\'Nessus\',5,5,5)'),
                entityManager.query('INSERT INTO t_company_users_user ("companyId","userId") VALUES(1,1)'),
                entityManager.query('INSERT INTO t_company_users_user ("companyId","userId") VALUES(1,7)'),
                entityManager.query('INSERT INTO t_company_users_user ("companyId","userId") VALUES(5,1)'),
                entityManager.query('INSERT INTO t_company_users_user ("companyId","userId") VALUES(5,6)'),
                entityManager.query('INSERT INTO t_group ("id","name","companyId")  VALUES (1,\'Group1\',1)'),
                entityManager.query('INSERT INTO t_group ("id","name","companyId")  VALUES (2,\'Group2\',1)'),
                entityManager.query('INSERT INTO t_group ("id","name","companyId") VALUES (3,\'ModGroup\',1)'),
                entityManager.query('INSERT INTO t_group ("id","name","companyId") VALUES (4,\'DelGroup\',1)'),
                entityManager.query('INSERT INTO t_group ("id","name","companyId") VALUES (5,\'Group5\',5)')
            ]);


            //Vulnerabilities
            await Promise.all([
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (1,\'2018-01-01\',\'Description1\',\'2018-01-01\',\'Test1\',\'Vuln1\',\'2018-01-01\',0,\'Solution1\',0,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (2,\'2018-01-01\',\'Description2\',\'2018-01-01\',\'Test2\',\'NeoVuln\',\'2018-01-01\',0,\'Solution1\',0,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (3,\'2018-01-01\',\'Description3\',\'2018-01-01\',\'Test3\',\'ModVuln\',\'2018-01-01\',0,\'Solution1\',0,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (4,\'2018-01-01\',\'Description4\',\'2018-01-01\',\'Test4\',\'DelVuln\',\'2018-01-01\',0,\'Solution1\',0,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (5,\'2018-01-01\',\'Description5\',\'2018-01-01\',\'Test5\',\'Vuln5\',\'2018-01-01\',0,\'Solution1\',0,5,NULL,5)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (6,\'2018-01-01\',\'Description6\',\'2018-01-01\',\'Test6\',\'OpenToCloseVuln\',\'2018-01-01\',0,\'Solution1\',0,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (7,\'2018-01-01\',\'Description7\',\'2018-01-01\',\'Test7\',\'OpenToAssumedVuln\',\'2018-01-01\',0,\'Solution1\',0,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (8,\'2018-01-01\',\'Description8\',\'2018-01-01\',\'Test8\',\'OpenToFalseVuln\',\'2018-01-01\',0,\'Solution1\',0,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (9,\'2018-01-01\',\'Description9\',\'2018-01-01\',\'Test9\',\'RevisionToOpenVuln\',\'2018-01-01\',0,\'Solution1\',3,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (10,\'2018-01-01\',\'Description10\',\'2018-01-01\',\'Test10\',\'RevisionToCloseVuln\',\'2018-01-01\',0,\'Solution1\',3,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (11,\'2018-01-01\',\'Description11\',\'2018-01-01\',\'Test11\',\'AssumedVuln\',\'2018-01-01\',0,\'Solution1\',4,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (12,\'2018-01-01\',\'Description12\',\'2018-01-01\',\'Test12\',\'FalsePositiveVuln1\',\'2018-01-01\',0,\'Solution1\',2,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (13,\'2018-01-01\',\'Description13\',\'2018-01-01\',\'Test13\',\'CloseVuln\',\'2018-01-01\',0,\'Solution1\',1,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (14,\'2018-01-01\',\'Description14\',\'2018-01-01\',\'Test14\',\'OpenToRevisionVuln\',\'2018-01-01\',0,\'Solution1\',0,1,NULL,1)'),
                entityManager.query('INSERT INTO t_vulnerability ("id","communication_date","description","discovery_date","executedText","name","resolution_date","risk","solution","status","auditId","linkedVulnerabilityId","companyId") VALUES (15,\'2018-01-01\',\'Description15\',\'2018-01-01\',\'Test15\',\'AssumedToOpenVuln\',\'2018-01-01\',0,\'Solution1\',4,1,NULL,1)'),
            ]);

            /*/Evidences
            await Promise.all([
                entityManager.query("INSERT INTO t_evidence VALUES (1,'dcdf86a4c5a1d00da4bf221063cd4e92377a4d3b43740403485fdac91071aec9',1,'Evidence Description',0)")
            ])*/

            //Groups-Users
            await Promise.all([
                entityManager.query('INSERT INTO t_group_users_user ("groupId","userId") VALUES (1,1)'),
                entityManager.query('INSERT INTO t_group_users_user ("groupId","userId") VALUES (5,1)'),
                entityManager.query('INSERT INTO t_group_users_user ("groupId","userId") VALUES (5,5)'),
                entityManager.query('INSERT INTO t_group_users_user ("groupId","userId") VALUES (5,6)'),
                entityManager.query('INSERT INTO t_group_assets_asset ("groupId","assetId") VALUES (1,1)'),
                entityManager.query('INSERT INTO t_group_assets_asset ("groupId","assetId") VALUES (1,2)'),
                entityManager.query('INSERT INTO t_group_assets_asset ("groupId","assetId") VALUES (5,5)'),
                entityManager.query('INSERT INTO t_integration ("id","kind","comment","ndone","ntotal","papDate","status","startDate","assetId") VALUES(1,0,\'Integration1\',2,4,\'2019-12-01\',0,\'2019-11-01\',1)'),
                entityManager.query('INSERT INTO t_integration ("id","kind","comment","ndone","ntotal","papDate","status","startDate","assetId") VALUES(2,0,\'NeoIntegration1\',2,4,\'2019-12-01\',0,\'2019-11-01\',1)'),
                entityManager.query('INSERT INTO t_integration ("id","kind","comment","ndone","ntotal","papDate","status","startDate","assetId") VALUES(3,0,\'ModIntegration1\',2,4,\'2019-12-01\',0,\'2019-11-01\',1)'),
                entityManager.query('INSERT INTO t_integration ("id","kind","comment","ndone","ntotal","papDate","status","startDate","assetId") VALUES(4,0,\'DelIntegration1\',2,4,\'2019-12-01\',0,\'2019-11-01\',1)'),
                entityManager.query('INSERT INTO t_integration ("id","kind","comment","ndone","ntotal","papDate","status","startDate","assetId") VALUES(5,0,\'Integration5\',2,4,\'2019-12-01\',0,\'2019-11-01\',5)')
            ]);

            await Promise.all([
                entityManager.query('INSERT INTO t_responsable_to_asset ("responsableId","assetId","role","info") VALUES(1,1,\'RFA\',\'Approval\')'),
                entityManager.query('INSERT INTO t_responsable_to_asset ("responsableId","assetId","role","info") VALUES(5,5,\'RFA\',\'Approval\')'),
                entityManager.query("ALTER SEQUENCE t_test_id_seq RESTART WITH 6"),
                entityManager.query("ALTER SEQUENCE t_user_id_seq RESTART WITH 8"),
                entityManager.query("ALTER SEQUENCE t_evidence_id_seq RESTART WITH 1"),
                entityManager.query("ALTER SEQUENCE t_vulnerability_id_seq RESTART WITH 16"),
                entityManager.query("ALTER SEQUENCE t_company_id_seq RESTART WITH 6"),
                entityManager.query("ALTER SEQUENCE t_methodology_id_seq RESTART WITH 6"),
                entityManager.query("ALTER SEQUENCE t_group_id_seq RESTART WITH 6"),
                entityManager.query("ALTER SEQUENCE t_profile_id_seq RESTART WITH 6"),
                entityManager.query("ALTER SEQUENCE t_area_id_seq RESTART WITH 6"),
                entityManager.query("ALTER SEQUENCE t_asset_id_seq RESTART WITH 6"),
                entityManager.query("ALTER SEQUENCE t_url_id_seq RESTART WITH 5"),
                entityManager.query("ALTER SEQUENCE t_audit_id_seq RESTART WITH 6"),
                entityManager.query("ALTER SEQUENCE t_department_id_seq RESTART WITH 5"),
                entityManager.query("ALTER SEQUENCE t_integration_id_seq RESTART WITH 5"),
                entityManager.query("ALTER SEQUENCE t_responsable_id_seq RESTART WITH 5"),
                entityManager.query("ALTER SEQUENCE t_knowledge_base_id_seq RESTART WITH 6")
            ]);

            app = new App([
                new CompanyController(),
                new AuthenticationController(),
                new UserController(),
                new ProfileController(),
                new GroupController(),
                new AreaController(),
                new AssetController(),
                new DepartmentController(),
                new AuditController(),
                new IntegrationController(),
                new ResponsableController(),
                new TagController(),
                new UrlController(),
                new VulnerabilityController(),
                new EvidenceController(),
                new MethodologyController(),
                new KnowledgeBaseController(),
                new JiraController()
            ]);

            await app.listen();

            await request(app.getServer())
                .post("/auth/login")
                .send({ name: "User1", password: "User1" })
                .then(res => {
                    token = res.body.token;
                });

            await request(app.getServer())
                .post("/auth/login")
                .send({ name: "User6", password: "User1" })
                .then(res => {
                    tokenCompany2 = res.body.token;
                });

            await request(app.getServer())
                .post("/auth/login")
                .send({ name: "User2", password: "User1" })
                .then(res => {
                    tokenWithoutPermissions = res.body.token;
                });

            await request(app.getServer())
                .post("/auth/login")
                .send({ name: "User7", password: "User1" })
                .then(res => {
                    tokenVuln = res.body.token;
                });
        } catch (error) {
            console.log(error)
        }
    });


    after(async function (done) {
        this.timeout(10000);
        await entityManager.query("DELETE FROM t_evidence");
        await entityManager.query("DELETE FROM t_department");
        await entityManager.query("DELETE FROM t_responsable_to_asset");
        await entityManager.query("DELETE FROM t_responsable");
        await entityManager.query("DELETE FROM t_integration");
        await entityManager.query("DELETE FROM t_group_assets_asset");
        await entityManager.query("DELETE FROM t_group_users_user");
        await entityManager.query("DELETE FROM t_group");
        await entityManager.query("DELETE FROM t_company_users_user");
        await entityManager.query("DELETE FROM t_user");
        await entityManager.query("DELETE FROM t_profile_functionalities_functionality");
        await entityManager.query("DELETE FROM t_functionality");
        await entityManager.query("DELETE FROM t_vulnerability");
        await entityManager.query("DELETE FROM t_audit");
        await entityManager.query("DELETE FROM t_url");
        await entityManager.query("DELETE FROM t_asset");
        await entityManager.query("DELETE FROM t_test");
        await entityManager.query("DELETE FROM t_methodology");
        await entityManager.query("DELETE FROM t_area");
        await entityManager.query("DELETE FROM t_profile");
        await entityManager.query("DELETE FROM t_knowledge_base");
        await entityManager.query("DELETE FROM t_company");
        await connection.close()
        await app.closeServer()
        process.kill(process.pid, 'SIGTERM')
    });

    describe("Company endpoints", () => {
        describe("Get all companies", () => {
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/companies/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Without perms, it is not possible to get the companies", (done) => {
                request(app.getServer())
                    .post("/companies/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Without filters, all the companies are recovered", (done) => {
                request(app.getServer())
                    .post("/companies/search")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].length, 5);
                        done()
                    })
            });
            it("It is possible to filter companies by name", (done) => {
                request(app.getServer())
                    .post("/companies/search")
                    .send([{ name: "Mod" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0][0].name, "ModCompany");
                        done()
                    })
            })
        });
        describe("Get one company", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/companies/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/companies/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Company not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/companies/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Company does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve companies by id", (done) => {
                request(app.getServer())
                    .get("/companies/2")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "NeoCompany");
                        equal(res.body.description, "C2");
                        done()
                    })
            });
        });
        describe("Update one company", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/companies/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/companies/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Company not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/companies/212")
                    .send({ name: "NewAmazon" })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Company does not exist");
                        done()
                    })
            });
            it("It is possible to update company's name", (done) => {
                request(app.getServer())
                    .patch("/companies/3")
                    .set("XToken", token)
                    .send({ name: "NewAmazon" })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "NewAmazon");
                        equal(res.body.description, "C3");
                        done();
                    });
            });
            it("It is possible to update company's description", (done) => {
                request(app.getServer())
                    .patch("/companies/3")
                    .set("XToken", token)
                    .send({ description: "New description" })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "NewAmazon");
                        equal(res.body.description, "New description");
                        done();
                    });
            });
        });
        describe("Add one company", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/companies")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/companies")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("New companies are created propperly", (done) => {
                request(app.getServer())
                    .post("/companies")
                    .send({ name: "Added Company", description: "New description" })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "Added Company");
                        equal(res.body.description, "New description");
                        done();
                    });
            });
            it("It is not possible to create a company which is already created", (done) => {
                request(app.getServer())
                    .post("/companies")
                    .set("XToken", token)
                    .send({ name: "C1", description: "addescription" })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Company's name is mandatory", (done) => {
                request(app.getServer())
                    .post("/companies")
                    .set("XToken", token)
                    .send({ description: "addescription" })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Company's description is mandatory", (done) => {
                request(app.getServer())
                    .post("/companies")
                    .set("XToken", token)
                    .send({ name: "addedname" })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one company", () => {

            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/companies/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/companies/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Company not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/companies/212")
                    .set("XToken", token)
                    .send({ name: "NewAmazon" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Company does not exist");
                        done()
                    })
            });
            it("Companies are deleted", (done) => {
                request(app.getServer())
                    .delete("/companies/4")
                    .set("XToken", token)
                    .then(res => {
                        request(app.getServer())
                            .get("/companies/4")
                            .set("XToken", token)
                            .then(res => {
                                equal(res.status, 404);
                                done()
                            })
                    })
            });
            //it("[TODO] - When a company is deleted, its areas are deleted too");
            //it("[TODO] - When a company is deleted, its groups are deleted too");
        })
    });
    describe("Profile endpoints", () => {
        describe("Get all profiles", () => {
            it("Without perms,it is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/profiles/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/profiles/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Without filters, all profiles are recovered", (done) => {
                request(app.getServer())
                    .post("/profiles/search")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].length, 5);
                        done()
                    })
            });
            it("It is possible to filter profiles by name", (done) => {
                request(app.getServer())
                    .post("/profiles/search")
                    .send([{ name: "file2" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0][0].name, "Profile2");
                        done()
                    })
            })
        });
        describe("Get one profile", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/profiles/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/profiles/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Profile not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/profiles/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Profile does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve a profiles and its functionalities by id", (done) => {
                request(app.getServer())
                    .get("/profiles/1")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Profile1");
                        equal(res.body.functionalities.find(function (elem) {
                            return elem.name == "GET COMPANIES"
                        }).name, "GET COMPANIES");
                        equal(res.body.functionalities.find(function (elem) {
                            return elem.name == "ADD COMPANIES"
                        }).name, "ADD COMPANIES");
                        done()
                    })
            });

        });
        describe("Update one profile", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/profiles/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/profiles/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Profile not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/profiles/212")
                    .set("XToken", token)
                    .send({ name: "NewProfile" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Profile does not exist");
                        done()
                    })
            });
            it("It is possible to update profile's name", (done) => {
                request(app.getServer())
                    .patch("/profiles/3")
                    .set("XToken", token)
                    .send({ name: "ProfileModifyed" })
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "ProfileModifyed");
                        done();
                    });
            });
            it("It is possible to update profile's functionalities", (done) => {
                request(app.getServer())
                    .patch("/profiles/3")
                    .set("XToken", token)
                    .send({
                        name: "UpdatedProfile", functionalities: [{
                            name: "MODIFY COMPANIES"
                        }, {
                            name: "DELETE COMPANIES"
                        }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "UpdatedProfile");
                        equal(res.body.functionalities.find(function (elem) {
                            return elem.name == "MODIFY COMPANIES"
                        }).name, "MODIFY COMPANIES");
                        equal(res.body.functionalities.find(function (elem) {
                            return elem.name == "DELETE COMPANIES"
                        }).name, "DELETE COMPANIES");
                        done();
                    });
            });
        });
        describe("Add one profile", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/profiles")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/profiles").then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("New profiles without functionalities are created propperly", (done) => {
                request(app.getServer())
                    .post("/profiles")
                    .set("XToken", token)
                    .send({ name: "Added Profile" })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Added Profile");
                        done();
                    });
            });

            it("New profiles with functionalities are created propperly", (done) => {
                request(app.getServer())
                    .post("/profiles")
                    .set("XToken", token)
                    .send({
                        name: "NEOProfile", functionalities: [{
                            name: "MODIFY COMPANIES"
                        }, {
                            name: "DELETE COMPANIES"
                        }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "NEOProfile");
                        equal(res.body.functionalities.find(function (elem) {
                            return elem.name == "MODIFY COMPANIES"
                        }).name, "MODIFY COMPANIES");
                        equal(res.body.functionalities.find(function (elem) {
                            return elem.name == "DELETE COMPANIES"
                        }).name, "DELETE COMPANIES");
                        done();
                    });
            });

            it("It is not possible to create a profile which is already created", (done) => {
                request(app.getServer())
                    .post("/profiles")
                    .send({ name: "Profile1" })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Profile's name is mandatory", (done) => {
                request(app.getServer())
                    .post("/profiles")
                    .send({
                        functionalities: [{
                            name: "MODIFY COMPANIES"
                        }, {
                            name: "DELETE COMPANIES"
                        }
                        ]
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one profile", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/profiles/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/profiles/1").then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Profile not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/profiles/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Profile does not exist");
                        done()
                    })
            });
            it("Profiles are deleted", (done) => {
                request(app.getServer())
                    .delete("/profiles/4")
                    .set("XToken", token)
                    .then(res => {
                        request(app.getServer())
                            .get("/profiles/4")
                            .set("XToken", token)
                            .then(res => {
                                equal(res.status, 404);
                                done()
                            })
                    })
            });
        });
    });
    describe("User endpoints", () => {
        describe("Get all users", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/users/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/users/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Without filters, all users are recovered", (done) => {
                request(app.getServer())
                    .post("/users/search")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].length, 7);
                        done()
                    })
            });
            it("It is possible to filter users by name", (done) => {
                request(app.getServer())
                    .post("/users/search")
                    .send([{ "name": "Del" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].length, 1);
                        equal(res.body[0][0].name, "DelUser");
                        done()
                    })
            })
        });
        describe("Get one user", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/users/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/users/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("User not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/users/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "User does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve a user and its profile by id", (done) => {
                request(app.getServer())
                    .get("/users/1")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "User1");
                        equal(res.body.profile.name, "Profile1");
                        done()
                    })
            });

        });
        describe("Update one user", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/users/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/users/1")
                    .send({
                        name: "NewUser"
                    })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("User not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/users/212")
                    .set("XToken", token)
                    .send({ name: "UpdateUser" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "User does not exist");
                        done()
                    })
            });
            it("It is possible to update user's name", (done) => {
                request(app.getServer())
                    .patch("/users/3")
                    .set("XToken", token)
                    .send({ name: "UserModifyed" })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "UserModifyed");
                        done();
                    });
            });
            it("It is possible to update user's password", (done) => {
                request(app.getServer())
                    .patch("/users/3")
                    .set("XToken", token)
                    .send({ password: "NewPassword" })
                    .then(async res => {
                        equal(res.status, 200);
                        const user = await entityManager.findOne(User, { where: { id: 3 }, select: ["password"] });
                        const compare = await bcrypt.compare("NewPassword", user.password);
                        equal(true, compare);
                        done();
                    });
            });
            it("It is possible to update user's profile", (done) => {
                request(app.getServer())
                    .patch("/users/3")
                    .set("XToken", token)
                    .send({
                        name: "NewModifyedUser12", profile: {
                            id: 1
                        }
                    })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "NewModifyedUser12");
                        equal(res.body.profile.id, 1);
                        done();
                    });
            });
            it("It is possible to update user's company", (done) => {
                request(app.getServer())
                    .patch("/users/3")
                    .set("XToken", token)
                    .send({
                        companies: [{
                            id: 2
                        }]
                    })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.companies[0].id, 2);
                        done();
                    });
            });
        });
        describe("Add one user", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/users")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/users")
                    .send({
                        name: "NewUser", password: "A", profile: {
                            id: "2"
                        }, companies: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("New users with profiles are created propperly", (done) => {
                request(app.getServer())
                    .post("/users")
                    .set("XToken", token)
                    .send({
                        name: "NewUser", password: "A", profile: {
                            id: 1
                        }, companies: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    })
                    .then(async res => {
                        equal(res.status, 201);
                        equal(res.body.id, 8);
                        equal(res.body.name, "NewUser");
                        equal(res.body.profile.id, 1);
                        equal(res.body.companies.length, 2);
                        done();
                    });
            });

            it("It is not possible to create a user without password", (done) => {
                request(app.getServer())
                    .post("/users")
                    .set("XToken", token)
                    .send({
                        name: "NewUser", profile: {
                            id: "2"
                        }, companies: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("It is not possible to create a user without name", (done) => {
                request(app.getServer())
                    .post("/users")
                    .set("XToken", token)
                    .send({
                        password: "A", profile: {
                            id: "2"
                        }, companies: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("It is not possible to create a user without companies", (done) => {
                request(app.getServer())
                    .post("/users")
                    .set("XToken", token)
                    .send({
                        password: "A", profile: {
                            id: "2"
                        }
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one user", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/users/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/users/4")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("User not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/users/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "User does not exist");
                        done()
                    })
            });
            it("Users are deleted", (done) => {
                request(app.getServer())
                    .delete("/users/4")
                    .set("XToken", token)
                    .then(res => {
                        request(app.getServer())
                            .get("/users/4")
                            .set("XToken", token)
                            .then(res => {
                                equal(res.status, 404);
                                done()
                            })
                    })
            });
        });
    });
    describe("Group endpoints", () => {
        describe("Get all groups", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/groups/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/groups/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Users can only see groups which belong to their companies", (done) => {
                request(app.getServer())
                    .post("/groups/search")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.length, 1);
                        done()
                    })
            });
            it("It is possible to filter groups by name", (done) => {
                request(app.getServer())
                    .post("/groups/search")
                    .send([{ name: "p2" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].name, "Group2");
                        done()
                    })
            })
        });
        describe("Get one group", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/groups/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/groups/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Group not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/groups/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });
            it("User cannot see groups from other companies", (done) => {
                request(app.getServer())
                    .get("/groups/1")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve a group and its users and assets by id", (done) => {
                request(app.getServer())
                    .get("/groups/1")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Group1");
                        equal(res.body.users[0].id, 1);
                        done()
                    })
            });

        });
        describe("Get one group assets", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/groups/1/assets")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/groups/1/assets")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Group not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/groups/121/assets")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });
            it("User cannot see groups from other companies", (done) => {
                request(app.getServer())
                    .get("/groups/1/assets")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve a group and its assets by id", (done) => {
                request(app.getServer())
                    .get("/groups/1/assets")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.length, 2);
                        done()
                    })
            });
        });
        describe("Get one group users", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/groups/1/users")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/groups/1/users")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Group not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/groups/212/users")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });
            it("User cannot see groups from other companies", (done) => {
                request(app.getServer())
                    .get("/groups/1/users")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve a group and its users and assets by id", (done) => {
                request(app.getServer())
                    .get("/groups/1/users")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.length, 1);
                        done()
                    })
            });

        });
        describe("Update one group", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/groups/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/groups/1")
                    .send({ name: "NewGroup" })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("Group not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/groups/212")
                    .set("XToken", token)
                    .send({ name: "NewGroup" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });

            it("It is not possible to update groups which belong to other company", (done) => {
                request(app.getServer())
                    .patch("/groups/1")
                    .set("XToken", tokenCompany2)
                    .send({ name: "NewGroup" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });
            it("It is possible to update group's name", (done) => {
                request(app.getServer())
                    .patch("/groups/3")
                    .send({ name: "GroupModifyed" })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "GroupModifyed");
                        done();
                    });
            });
            it("It is possible to update group's users", (done) => {
                request(app.getServer())
                    .patch("/groups/3")
                    .send({
                        name: "NGroup3", users: [{
                            id: 1
                        }, {
                            id: 2
                        }]
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "NGroup3");
                        equal(res.body.users.length, 2);
                        done();
                    });
            });
        });
        describe("Add one group", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/groups")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/groups")
                    .send({ name: "NewGroup" })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("New groups without users are created propperly", (done) => {
                request(app.getServer())
                    .post("/groups")
                    .send({
                        name: "NewGroup", company: {
                            id: 1
                        }
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "NewGroup");
                        done();
                    });
            });

            it("New groups with users are created propperly", (done) => {
                request(app.getServer())
                    .post("/groups")
                    .send({
                        name: "NEOGG", users: [{
                            id: 1
                        }], company: {
                            id: 1
                        }
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "NEOGG");
                        equal(res.body.users[0].id, 1);
                        done();
                    });
            });
            it("It is not possible to create groups which belong to other companies", (done) => {
                request(app.getServer())
                    .post("/groups")
                    .send({
                        name: "NEOGG2", users: [{
                            id: 1
                        }], company: {
                            id: 1
                        }
                    })
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 400);
                        equal(res.body.message, "User does not belong to that company");
                        done()
                    });
            });
            it("It is not possible to create a group which is already created", (done) => {
                request(app.getServer())
                    .post("/groups")
                    .send({
                        name: "Group1", company: {
                            id: 1
                        }
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Group's name is mandatory", (done) => {
                request(app.getServer())
                    .post("/groups")
                    .set("XToken", token)
                    .send({
                        users: [{
                            id: 1
                        }, {
                            id: 2
                        }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Group's company is mandatory", (done) => {
                request(app.getServer())
                    .post("/groups")
                    .set("XToken", token)
                    .send({
                        name: "Group1",
                        users: [{
                            id: 1
                        }, {
                            id: 2
                        }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one group", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/groups/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/groups/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Group not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/groups/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });
            it("It is not possible to delete groups that belong to other companies", (done) => {
                request(app.getServer())
                    .delete("/groups/1")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Group does not exist");
                        done()
                    })
            });
            it("Groups are deleted but its users are not deleted", (done) => {
                request(app.getServer())
                    .delete("/groups/4")
                    .set("XToken", token)
                    .then(res => {
                        request(app.getServer())
                            .get("/groups/4")
                            .set("XToken", token)
                            .then(res2 => {
                                equal(res2.status, 404);
                                request(app.getServer())
                                    .get("/users/1")
                                    .set("XToken", token)
                                    .then(res3 => {
                                        equal(res3.status, 200);
                                        done()
                                    })
                            })
                    })
            });
        });
    });
    describe("Area endpoints", () => {
        describe("Get all areas", () => {
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/areas/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Without perms, is not possible to get the areas", (done) => {
                request(app.getServer())
                    .post("/areas/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });


            it("Without filters, all the areas are recovered", (done) => {
                request(app.getServer())
                    .post("/areas/search")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].length, 5);
                        done()
                    })
            });
            it("It is possible to filter areas by name", (done) => {
                request(app.getServer())
                    .post("/areas/search")
                    .send([{ name: "a2" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0][0].name, "Area2");
                        done()
                    })
            })
        });
        describe("Get one area", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/areas/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/areas/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Area not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/areas/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Area does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve areas by id", (done) => {
                request(app.getServer())
                    .get("/areas/2")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Area2");
                        done()
                    })
            });
        });
        describe("Get one area departments", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/areas/1/departments")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/areas/1/departments")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Area not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/areas/212/departments")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Area does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve areas departments by id", (done) => {
                request(app.getServer())
                    .get("/areas/1/departments")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.length, 4);
                        done()
                    })
            });
        });
        describe("Get one area assets", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/areas/1/assets")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/areas/1/assets")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Area not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/areas/212/assets")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Area does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve areas assets by id", (done) => {
                request(app.getServer())
                    .get("/areas/1/assets")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.length, 4);
                        done()
                    })
            });
        });
        describe("Update one area", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/areas/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/areas/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Area not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/areas/212")
                    .send({ name: "NewAmazon" })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Area does not exist");
                        done()
                    })
            });
            it("It is possible to update area's name", (done) => {
                request(app.getServer())
                    .patch("/areas/3")
                    .set("XToken", token)
                    .send({ name: "AreaModify" })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "AreaModify");
                        done();
                    });
            });
        });
        describe("Add one area", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/areas")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/areas")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("New areas are created propperly", (done) => {
                request(app.getServer())
                    .post("/areas")
                    .send({
                        name: "Addeda Area", company: {
                            id: 1
                        }
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "Addeda Area");
                        done();
                    });
            });
            it("It is not possible to create a area which is already created", (done) => {
                request(app.getServer())
                    .post("/areas")
                    .set("XToken", token)
                    .send({ name: "Area1" })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Area's name is mandatory", (done) => {
                request(app.getServer())
                    .post("/areas")
                    .set("XToken", token)
                    .send({})
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one area", () => {

            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/areas/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/areas/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Area not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/areas/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Area does not exist");
                        done()
                    })
            });
            it("Areas are deleted", (done) => {
                request(app.getServer())
                    .delete("/areas/4")
                    .set("XToken", token)
                    .then(res => {
                        request(app.getServer())
                            .get("/areas/4")
                            .set("XToken", token)
                            .then(res => {
                                equal(res.status, 404);
                                done()
                            })
                    })
            });
        })
    });
    describe("Asset endpoints", () => {
        describe("Get all assets", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/assets/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/assets/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Users can only see assets which belong to their companies", (done) => {
                request(app.getServer())
                    .post("/assets/search")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].length, 1);
                        done()
                    })
            });
            it("It is possible to filter assets by name", (done) => {
                request(app.getServer())
                    .post("/assets/search")
                    .send([{ name: "1" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0][0].name, "Asset 1");
                        done()
                    })
            })
        });
        describe("Get one asset", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/assets/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/assets/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Asset not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/assets/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });
            it("User cannot see assets from other companies", (done) => {
                request(app.getServer())
                    .get("/assets/1")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve an asset and its audits and vulnerabilities by id", (done) => {
                request(app.getServer())
                    .get("/assets/1")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Asset 1");
                        equal(res.body.audits.length, 4);
                        done()
                    })
            });

        });
        describe("Get one asset audits", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/assets/1/audits")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/assets/1/audits")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Asset not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/assets/121/audits")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });
            it("User cannot see assets from other companies", (done) => {
                request(app.getServer())
                    .get("/assets/1/audits")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve an asset and its audits by id", (done) => {
                request(app.getServer())
                    .get("/assets/1/audits")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.length, 4);
                        done()
                    })
            });
        });
        describe("Get one asset groups", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/assets/1/groups")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/assets/1/groups")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Asset not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/assets/212/groups")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });
            it("User cannot see assets from other companies", (done) => {
                request(app.getServer())
                    .get("/assets/1/groups")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve an asset and its groups by id", (done) => {
                request(app.getServer())
                    .get("/assets/1/groups")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.length, 1);
                        done()
                    })
            });

        });
        describe("Update one asset", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/assets/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/assets/1")
                    .send({ name: "NewAsset" })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("Asset not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/assets/212")
                    .set("XToken", token)
                    .send({ name: "NewAsset" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });

            it("It is not possible to update assets which belong to other company", (done) => {
                request(app.getServer())
                    .patch("/assets/1")
                    .set("XToken", tokenCompany2)
                    .send({ name: "NewAsset" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });
            it("It is possible to update assets's name", (done) => {
                request(app.getServer())
                    .patch("/assets/3")
                    .send({ name: "AssetModifyed" })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "AssetModifyed");
                        done();
                    });
            });
        });
        describe("Add one asset", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/assets")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/assets")
                    .send({ name: "NewAsset" })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("New assets without groups are created propperly", (done) => {
                request(app.getServer())
                    .post("/assets")
                    .send({
                        name: "NewAsset", company: {
                            id: 1
                        }, enviroment: 0,
                        kind: 0,
                        status: 0,
                        visibility: 0,
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "NewAsset");
                        done();
                    });
            });

            it("New assets with groups are created propperly", (done) => {
                request(app.getServer())
                    .post("/assets")
                    .send({
                        name: "NEOAA", groups: [{
                            id: 1
                        }], company: {
                            id: 1
                        }, enviroment: 0,
                        kind: 0,
                        status: 0,
                        visibility: 0
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "NEOAA");
                        equal(res.body.groups[0].id, 1);
                        done();
                    });
            });
            it("It is not possible to create assets which belong to other companies", (done) => {
                request(app.getServer())
                    .post("/assets")
                    .send({
                        name: "NEOAA2", company: {
                            id: 1
                        }, enviroment: 0,
                        kind: 0,
                        status: 0,
                        visibility: 0
                    })
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 400);
                        equal(res.body.message, "User does not belong to that company");
                        done()
                    });
            });
            it("It is not possible to create an asset which is already created", (done) => {
                request(app.getServer())
                    .post("/assets")
                    .send({
                        name: "A1", company: {
                            id: 1
                        }
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Asset's name is mandatory", (done) => {
                request(app.getServer())
                    .post("/assets")
                    .set("XToken", token)
                    .send({
                        users: [{
                            id: 1
                        }, {
                            id: 2
                        }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Asset's company is mandatory", (done) => {
                request(app.getServer())
                    .post("/assets")
                    .set("XToken", token)
                    .send({
                        name: "Aa1",
                        users: [{
                            id: 1
                        }, {
                            id: 2
                        }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one asset", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/assets/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/assets/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Asset not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/assets/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });
            it("It is not possible to delete assets that belong to other companies", (done) => {
                request(app.getServer())
                    .delete("/assets/1")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Asset does not exist");
                        done()
                    })
            });
        });
    });
    describe("Audit endpoints", () => {
        describe("Get all audits", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/audits/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/audits/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Users can only see audits which belong to their companies", (done) => {
                request(app.getServer())
                    .post("/audits/search")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].length, 1);
                        done()
                    })
            });
            it("It is possible to filter audits by name", (done) => {
                request(app.getServer())
                    .post("/audits/search")
                    .send([{ name: "1" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0][0].name, "Audit1");
                        done()
                    })
            })
        });
        describe("Get one audit", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/audits/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/audits/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Audit not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/audits/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Audit does not exist");
                        done()
                    })
            });
            it("User cannot see audits from other companies", (done) => {
                request(app.getServer())
                    .get("/audits/1")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Audit does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve an audit and its vulnerabilities by id", (done) => {
                request(app.getServer())
                    .get("/audits/1")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Audit1");
                        equal(res.body.vulnerabilities.length, 14);
                        done()
                    })
            });

        });
        describe("Get one audit vulnerabilities", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/audits/1/vulnerabilities")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/audits/1/vulnerabilities")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Audit not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/audits/123/vulnerabilities")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Audit does not exist");
                        done()
                    })
            });
            it("User cannot see audits from other companies", (done) => {
                request(app.getServer())
                    .get("/audits/1/vulnerabilities")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Audit does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve an audit and its vulnerabilities by id", (done) => {
                request(app.getServer())
                    .get("/audits/1/vulnerabilities")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.length, 14);
                        done()
                    })
            });
        });
        describe("Update one audit", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/audits/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/audits/1")
                    .send({ name: "NewAudit" })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("Audit not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/audits/212")
                    .set("XToken", token)
                    .send({ name: "NewAAudit" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Audit does not exist");
                        done()
                    })
            });

            it("It is not possible to update audits which belong to other company", (done) => {
                request(app.getServer())
                    .patch("/audits/1")
                    .set("XToken", tokenCompany2)
                    .send({ name: "NewAudit" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Audit does not exist");
                        done()
                    })
            });
            it("It is possible to update audits's name", (done) => {
                request(app.getServer())
                    .patch("/audits/3")
                    .send({ name: "AuditModifyed" })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "AuditModifyed");
                        done();
                    });
            });
        });
        describe("Add one audit", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/audits")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/audits")
                    .send({ name: "NewAudit" })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("New audits are created propperly", (done) => {
                request(app.getServer())
                    .post("/audits")
                    .send({
                        name: "NewAudit", asset: {
                            id: 1
                        }, methodology: 0,
                        scheduled: "2018-01-01", company: {
                            id: 1
                        }, kind: "Acunetix"
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "NewAudit");
                        done();
                    });
            });
            it("It is not possible to create audits which belong to other companies", (done) => {
                request(app.getServer())
                    .post("/audits")
                    .send({
                        name: "NEOAA2", asset: {
                            id: 1
                        }, methodology: 0,
                        scheduled: "2018-01-01", company: {
                            id: 1
                        }, kind: "Acunetix"
                    })
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 400);
                        equal(res.body.message, "User does not belong to that company");
                        done()
                    });
            });
            it("It is not possible to create an audit which is already created", (done) => {
                request(app.getServer())
                    .post("/audits")
                    .send({
                        name: "Audit1", asset: {
                            id: 1
                        }, methodology: 0,
                        scheduled: "2018-01-01", company: {
                            id: 1
                        }, kind: "Acunetix"
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Audit's name is mandatory", (done) => {
                request(app.getServer())
                    .post("/audits")
                    .set("XToken", token)
                    .send({
                        asset: {
                            id: 1
                        }, methodology: 0,
                        scheduled: "2018-01-01", company: {
                            id: 1
                        }, kind: "Acunetix"
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Audit's company is mandatory", (done) => {
                request(app.getServer())
                    .post("/audits")
                    .set("XToken", token)
                    .send({
                        name: "A1", asset: {
                            id: 1
                        }, methodology: 0,
                        scheduled: "2018-01-01", kind: "Acunetix"
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one audit", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/audits/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/audits/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Audit not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/audits/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Audit does not exist");
                        done()
                    })
            });
            it("It is not possible to delete audits that belong to other companies", (done) => {
                request(app.getServer())
                    .delete("/audits/1")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Audit does not exist");
                        done()
                    })
            });
            it("It is possible to delete one audit, and when it is deleted, its vulnerabilities are deleted too", (done) => {
                request(app.getServer())
                    .delete("/audits/3")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        done();
                    })
            })
        });
    });
    describe("Vulnerability endpoints", () => {
        describe("Get all vulnerabilities", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Users can only see vulnerabilities which belong to their groups", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities/search")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.length, 1);
                        done()
                    })
            });
            it("It is possible to filter vulnerabilities by name", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities/search")
                    .send([{ name: "ssumedT" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].name, "AssumedToOpenVuln");
                        done()
                    })
            })
        });
        describe("Get one vulnerability", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/vulnerabilities/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/vulnerabilities/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Vulnerability not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/vulnerabilities/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Vulnerability does not exist");
                        done()
                    })
            });
            it("User cannot see vulnerabilities from other companies", (done) => {
                request(app.getServer())
                    .get("/vulnerabilities/1")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Vulnerability does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve a vulnerability, its asset, the url and the audit by id", (done) => {
                request(app.getServer())
                    .get("/vulnerabilities/1")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Vuln1");
                        equal(res.body.audit.url.id, 1);
                        equal(res.body.audit.asset.id, 1);
                        done()
                    })
            });

        });
        describe("Update one vulnerability", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/vulnerabilities/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/vulnerabilities/1")
                    .send({ name: "NewAudit" })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("Vulnerability not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/vulnerabilities/212")
                    .set("XToken", token)
                    .send({ name: "NewVVulnerability" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Vulnerability does not exist");
                        done()
                    })
            });

            it("It is not possible to update vulnerabilities which belong to other company", (done) => {
                request(app.getServer())
                    .patch("/vulnerabilities/1")
                    .set("XToken", tokenCompany2)
                    .send({ name: "NewVulnerability" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Vulnerability does not exist");
                        done()
                    })
            });
            it("It is possible to update vulnerabilities's name", (done) => {
                request(app.getServer())
                    .patch("/vulnerabilities/3")
                    .send({ name: "VulnerabilityModifyed" })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "VulnerabilityModifyed");
                        done();
                    });
            });
        });
        describe("Add one vulnerability", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities")
                    .send({ name: "NewVulnerability" })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("New vulnerabilities are created propperly", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities")
                    .send({
                        name: "NewVulnerability", audit: {
                            id: 1,
                            asset: {
                                id: 1
                            }, company: {
                                id: 1
                            }
                        }, company: {
                            id: 1
                        }, description: "My vuln 1",
                        executedText: "The test",
                        risk: 0,
                        solution: "My solution"
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "NewVulnerability");
                        done();
                    });
            });
            it("It is not possible to create vulnerabilities which belong to other companies", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities")
                    .send({
                        name: "NEOVV2", audit: {
                            id: 1,
                            asset: {
                                id: 1
                            }, company: {
                                id: 1
                            }
                        }, company: {
                            id: 1
                        }, description: "My vuln 1",
                        executedText: "The test",
                        risk: 0,
                        solution: "My solution"
                    })
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 400);
                        equal(res.body.message, "User does not belong to that company");
                        done()
                    });
            });
            it("Vuln's name is mandatory", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities")
                    .set("XToken", token)
                    .send({
                        asset: {
                            id: 1
                        }, methodology: 0,
                        scheduled: "2018-01-01", company: {
                            id: 1
                        }, kind: "Acunetix"
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Vulnerability's company is mandatory", (done) => {
                request(app.getServer())
                    .post("/vulnerabilities")
                    .set("XToken", token)
                    .send({
                        name: "NEOVV2", audit: {
                            id: 1,
                            asset: {
                                id: 1
                            }, company: {
                                id: 1
                            }
                        }, description: "My vuln 1",
                        executedText: "The test",
                        risk: 1,
                        solution: "My solution"
                    })
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one vulnerability", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/vulnerabilities/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/vulnerabilities/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Vulnerability not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/vulnerabilities/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Vulnerability does not exist");
                        done()
                    })
            });
            it("It is not possible to delete vulnerabilities that belong to other companies", (done) => {
                request(app.getServer())
                    .delete("/vulnerabilities/1")
                    .set("XToken", tokenCompany2)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Vulnerability does not exist");
                        done()
                    })
            });
            it("It is possible to delete one vulnerability", (done) => {
                request(app.getServer())
                    .delete("/vulnerabilities/3")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        done();
                    })
            })
        });
        describe("Vulnerability life cycle tests", () => {
            describe("Close vulnerabilities", () => {
                it("Without perms, is not possible to use the endpoint", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/6")
                        .send({ status: VulnerabilityStatus.CLOSED })
                        .set("XToken", tokenVuln)
                        .then(res => {
                            equal(res.status, 401);
                            equal(res.body.message, "Not enought permissions to close vulnerabilities");
                            done()
                        })
                });
                it("Assumed vulnerabilites cannot be closed", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/11")
                        .send({ status: VulnerabilityStatus.CLOSED })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Assumed vulnerabilities can only be opened again");
                            done()
                        })
                });
                it("False positive vulnerabilites cannot be closed", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/12")
                        .send({ status: VulnerabilityStatus.CLOSED })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Vulnerability is closed and its status cannot change");
                            done()
                        })
                });
                it("Closed vulnerabilites cannot be closed again", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/13")
                        .send({ status: VulnerabilityStatus.CLOSED })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Vulnerability is closed and its status cannot change");
                            done()
                        })
                });
                it("Open vulnerabilites can be closed", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/6")
                        .send({ status: VulnerabilityStatus.CLOSED })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 200);
                            equal(res.body.status, VulnerabilityStatus.CLOSED);
                            done()
                        })
                });
                it("On revision vulnerabilites can be closed", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/10")
                        .send({ status: VulnerabilityStatus.CLOSED })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 200);
                            equal(res.body.status, VulnerabilityStatus.CLOSED);
                            done()
                        })
                })

            });
            describe("Assume vulnerabilities", () => {
                it("Without perms, is not possible to use the endpoint", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/7")
                        .send({ status: VulnerabilityStatus.ASSUMED })
                        .set("XToken", tokenVuln)
                        .then(res => {
                            equal(res.status, 401);
                            equal(res.body.message, "Not enought permissions to assume vulnerabilities");
                            done()
                        })
                });
                it("False positive vulnerabilites cannot be assumed", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/12")
                        .send({ status: VulnerabilityStatus.CLOSED })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Vulnerability is closed and its status cannot change");
                            done()
                        })
                });
                it("Closed vulnerabilites cannot be assumed", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/13")
                        .send({ status: VulnerabilityStatus.ASSUMED })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Vulnerability is closed and its status cannot change");
                            done()
                        })
                });
                it("Open vulnerabilites can be assumed", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/7")
                        .send({ status: VulnerabilityStatus.ASSUMED })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 200);
                            equal(res.body.status, VulnerabilityStatus.ASSUMED);
                            done()
                        })
                })
            });
            describe("Open vulnerabilities again", () => {
                it("Without perms, is not possible to use the endpoint", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/9")
                        .send({ status: VulnerabilityStatus.OPEN })
                        .set("XToken", tokenVuln)
                        .then(res => {
                            equal(res.status, 401);
                            equal(res.body.message, "Not enought permissions to open a vulnerability again");
                            done()
                        })
                });
                it("Assumed vulnerabilites can be opened again", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/15")
                        .send({ status: VulnerabilityStatus.OPEN })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 200);
                            equal(res.body.status, VulnerabilityStatus.OPEN);
                            done()
                        })
                });
                it("On revision vulnerabilites can be opened again", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/9")
                        .send({ status: VulnerabilityStatus.OPEN })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 200);
                            equal(res.body.status, VulnerabilityStatus.OPEN);
                            done()
                        })
                });
                it("False positive vulnerabilites cannot be opened", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/12")
                        .send({ status: VulnerabilityStatus.OPEN })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Vulnerability is closed and its status cannot change");
                            done()
                        })
                });
                it("Closed vulnerabilites cannot be opened again", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/13")
                        .send({ status: VulnerabilityStatus.OPEN })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Vulnerability is closed and its status cannot change");
                            done()
                        })
                })
            });
            describe("Send vulnerabilities for revision", () => {
                it("Without perms, is not possible to use the endpoint", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/14")
                        .send({ status: VulnerabilityStatus.REVISION })
                        .set("XToken", tokenVuln)
                        .then(res => {
                            equal(res.status, 401);
                            equal(res.body.message, "Not enought permissions to send a vulnerability for revision");
                            done()
                        })
                });
                it("Assumed vulnerabilites cannot be sent for revision", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/11")
                        .send({ status: VulnerabilityStatus.REVISION })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Assumed vulnerabilities can only be opened again");
                            done()
                        })
                });
                it("Closed vulnerabilites cannot be sent for revision", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/13")
                        .send({ status: VulnerabilityStatus.REVISION })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Vulnerability is closed and its status cannot change");
                            done()
                        })
                });
                it("False positive vulnerabilites cannot be sent for revision", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/12")
                        .send({ status: VulnerabilityStatus.REVISION })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Vulnerability is closed and its status cannot change");
                            done()
                        })
                });
                it("Open vulnerabilites can be sent for revision", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/14")
                        .send({ status: VulnerabilityStatus.REVISION })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 200);
                            equal(res.body.status, VulnerabilityStatus.REVISION);
                            done()
                        })
                })

            });
            describe("Set vulnerabilities as false positive", () => {
                it("Without perms, is not possible to use the endpoint", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/8")
                        .send({ status: VulnerabilityStatus.FALSEPOSITIVE })
                        .set("XToken", tokenVuln)
                        .then(res => {
                            equal(res.status, 401);
                            equal(res.body.message, "Not enought permissions to set a vulnerability as a false positive");
                            done()
                        })
                });
                it("Assumed vulnerabilites cannot be set to false positives", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/11")
                        .send({ status: VulnerabilityStatus.FALSEPOSITIVE })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Assumed vulnerabilities can only be opened again");
                            done()
                        })
                });
                it("Closed vulnerabilites cannot be set to false positive", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/13")
                        .send({ status: VulnerabilityStatus.FALSEPOSITIVE })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 400);
                            equal(res.body.message, "Vulnerability is closed and its status cannot change");
                            done()
                        })
                });
                it("Open vulnerabilites can be set to false positive", (done) => {
                    request(app.getServer())
                        .patch("/vulnerabilities/8")
                        .send({ status: VulnerabilityStatus.FALSEPOSITIVE })
                        .set("XToken", token)
                        .then(res => {
                            equal(res.status, 200);
                            equal(res.body.status, VulnerabilityStatus.FALSEPOSITIVE);
                            done()
                        })
                })
            })

        })
    });
    describe("Evidence endpoints", () => {
        describe("Add evidence", () => {
            it("It is possible to add vulnerabilities", (done) => {
                request(app.getServer())
                    .post("/evidences")
                    .field('description', 'oe')
                    .field('company', 1)
                    .field('vulnerability', 1)
                    .field('class', EvidenceClass.FILE)
                    .attach('evidence', fs.readFileSync("./test.pdf"), "evidence.test")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 201);
                        done()
                    })
            })
        });
        describe("Get one evidence", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/evidences/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/evidences/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Evidence not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/evidences/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Evidence does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve an evidence and its vulnerability by id", (done) => {
                request(app.getServer())
                    .get("/evidences/1")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.vulnerability.id, 1);
                        equal(res.body.class, EvidenceClass.FILE);
                        equal(res.body.description, "oe");
                        equal(res.body.path, "dcdf86a4c5a1d00da4bf221063cd4e92377a4d3b43740403485fdac91071aec9");
                        done()
                    })
            });

        });
        describe("Update one evidence", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/evidences/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/evidences/1")
                    .send({
                        description: "NewEvidence"
                    })
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Evidence not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/evidences/212")
                    .set("XToken", token)
                    .send({ description: "UpdateEvidence" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Evidence does not exist");
                        done()
                    })
            });
            it("It is possible to update evidence's description", (done) => {
                request(app.getServer())
                    .patch("/evidences/1")
                    .set("XToken", token)
                    .send({ description: "UserEvidence" })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.description, "UserEvidence");
                        done();
                    });
            });
        });
        describe("Delete one evidence", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/evidences/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/evidences/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("Evidence not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/evidences/121")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Evidence does not exist");
                        done()
                    })
            });
            it("Evidences are deleted", (done) => {
                request(app.getServer())
                    .delete("/evidences/1")
                    .set("XToken", token)
                    .then(res => {
                        request(app.getServer())
                            .get("/evidences/1")
                            .set("XToken", token)
                            .then(res => {
                                equal(res.status, 404);
                                try {
                                    fs.existsSync("dcdf86a4c5a1d00da4bf221063cd4e92377a4d3b43740403485fdac91071aec9");
                                    fail()
                                } catch (error) {
                                    done()
                                }
                            })
                    })
            });
        });
    })
    describe("Methodology endpoints", () => {
        describe("Get all methodologies", () => {
            it("Without perms,it is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/methodologies/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/methodologies/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Without filters, all methodologies are recovered", (done) => {
                request(app.getServer())
                    .post("/methodologies/search")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].length, 5);
                        done()
                    })
            });
            it("It is possible to filter methodologies by name", (done) => {
                request(app.getServer())
                    .post("/methodologies/search")
                    .send([{ name: "oM" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0][0].name, "NeoMethodology");
                        done()
                    })
            })
        });
        describe("Get one methodology", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/methodologies/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/methodologies/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Methodology not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/methodologies/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Methodology does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve methodologies and its test by id", (done) => {
                request(app.getServer())
                    .get("/methodologies/1")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Methodology1");
                        equal("Tests done","Tests are not implemented yet")
                        done()
                    })
            });

        });
        describe("Update one methodology", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/methodologies/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/methodologies/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Methodology not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/methodologies/212")
                    .set("XToken", token)
                    .send({ name: "NewMethodology" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Methodology does not exist");
                        done()
                    })
            });
            it("It is possible to update methodology's name", (done) => {
                request(app.getServer())
                    .patch("/methodologies/3")
                    .set("XToken", token)
                    .send({ name: "MethodologyModifyed" })
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "MethodologyModifyed");
                        done();
                    });
            });
            it("It is possible to update methodologies tests", (done) => {
                request(app.getServer())
                    .patch("/methodologies/3")
                    .set("XToken", token)
                    .send({
                        name: "UpdatedMethodology"
                    })
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "UpdatedMethodology");
                        equal("false","tests are not implemented yet")
                        done();
                    });
            });
        });
        describe("Add one methodology", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/methodologies")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/methodologies").then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("New methodologies without tests", (done) => {
                request(app.getServer())
                    .post("/methodologies")
                    .set("XToken", token)
                    .send({ name: "Added Methodology", description : "dd" ,company : {
                        id : 1
                    } })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Added Methodology");
                        done();
                    });
            });

            it("New methodologies with tests are created propperly", (done) => {
                request(app.getServer())
                    .post("/methodologies")
                    .set("XToken", token)
                    .send({
                        name: "OWASP TOP 2",description : "dd", company : {
                            id : 1
                        }, tests: [ {
                            name: "INJECTION",
                            description : `Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent
                            to an interpreter as part of a command or query. The attacker’s hostile data can trick the
                            interpreter into executing unintended commands or accessing data without proper authorization.`
                        }, {
                            name: "BROKEN AUTHENTICATION",
                            description : `Application functions related to authentication and session management are often implemented
                            incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit
                            other implementation flaws to assume other users’ identities temporarily or permanently.`
                        }
                        ]
                    })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "OWASP TOP 2");
                        equal(res.body.tests.find(function (elem) {
                            return elem.name == "INJECTION"
                        }).name, "INJECTION");
                        equal(res.body.tests.find(function (elem) {
                            return elem.name == "BROKEN AUTHENTICATION"
                        }).name, "BROKEN AUTHENTICATION");
                        done();
                    });
            });

            it("It is not possible to create a methodology which is already created", (done) => {
                request(app.getServer())
                    .post("/methodologies")
                    .send({ name: "Methodology1",company : {
                        id : 1
                    } })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
            it("Methodologie's name is mandatory", (done) => {
                request(app.getServer())
                    .post("/methodologies")
                    .send({company : {
                        id : 1
                    }})
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one methodology", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/methodologies/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/methodologies/1").then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Methodology not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/methodologies/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Methodology does not exist");
                        done()
                    })
            });
            it("Methodologies are deleted", (done) => {
                request(app.getServer())
                    .delete("/methodologies/4")
                    .set("XToken", token)
                    .then(res => {
                        request(app.getServer())
                            .get("/methodologies/4")
                            .set("XToken", token)
                            .then(res => {
                                equal(res.status, 404);
                                done()
                            })
                    })
            });
        });
    });

    describe("Knowledge endpoints", () => {
        describe("Get all knowledge entries", () => {
            it("Without perms,it is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases/search")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases/search")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Without filters, all knowledges are recovered", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases/search")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0].length, 5);
                        done()
                    })
            });
            it("It is possible to filter knowledge by name", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases/search")
                    .send([{ name: "RS" }])
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body[0][0].name, "CORS");
                        done()
                    })
            })
        });
        describe("Get one knowledge  entry", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/knowledgeBases/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .get("/knowledgeBases/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Knowledge entry not found is handled propperly", (done) => {
                request(app.getServer())
                    .get("/knowledgeBases/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Knowledge entry does not exist");
                        done()
                    })
            });
            it("It is possible to retrieve a knowledge entry by id", (done) => {
                request(app.getServer())
                    .get("/knowledgeBases/1")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "XSS");
                        done()
                    })
            });

        });
        describe("Update one knowledge entry", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/knowledgeBases/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .patch("/knowledgeBases/1")
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Entry not found is handled propperly", (done) => {
                request(app.getServer())
                    .patch("/knowledgeBases/212")
                    .set("XToken", token)
                    .send({ name: "NewEntry" })
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Knowledge entry does not exist");
                        done()
                    })
            });
            it("It is possible to update entry's name", (done) => {
                request(app.getServer())
                    .patch("/knowledgeBases/3")
                    .set("XToken", token)
                    .send({ name: "EntryModifyed" })
                    .then(res => {
                        equal(res.status, 201);
                        equal(res.body.name, "EntryModifyed");
                        done();
                    });
            });
        });
        describe("Add one entry", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases").then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("New entries are created propperly", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases")
                    .set("XToken", token)
                    .send({ name: "Bypass authentication", category : "description", content : "yep" })
                    .then(res => {
                        equal(res.status, 200);
                        equal(res.body.name, "Bypass authentication");
                        done();
                    });
            });



            it("Name is mandatory", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases")
                    .send({
                        content : "a",
                        category : "description"
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });

            it("Content is mandatory", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases")
                    .send({
                        name : "a",
                        category : "description"
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });

            it("Category is mandatory", (done) => {
                request(app.getServer())
                    .post("/knowledgeBases")
                    .send({
                        content : "a",
                        name : "description"
                    })
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 400);
                        done();
                    });
            });
        });
        describe("Delete one entry", () => {
            it("Without perms, is not possible to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/knowledgeBases/1")
                    .set("XToken", tokenWithoutPermissions)
                    .then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });

            it("It is mandatory to be logged to use the endpoint", (done) => {
                request(app.getServer())
                    .delete("/knowledgeBases/1").then(res => {
                        equal(res.status, 401);
                        done()
                    })
            });
            it("Entry not found is handled propperly", (done) => {
                request(app.getServer())
                    .delete("/knowledgeBases/212")
                    .set("XToken", token)
                    .then(res => {
                        equal(res.status, 404);
                        equal(res.body.message, "Knowledge entry does not exist");
                        done()
                    })
            });
            it("Entries are deleted", (done) => {
                request(app.getServer())
                    .delete("/knowledgeBases/4")
                    .set("XToken", token)
                    .then(res => {
                        request(app.getServer())
                            .get("/knowledgeBases/4")
                            .set("XToken", token)
                            .then(res => {
                                equal(res.status, 404);
                                done()
                            })
                    })
            });
        });
    });    
});
