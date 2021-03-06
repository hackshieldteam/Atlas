import {MigrationInterface, QueryRunner} from 'typeorm';

export class Seed1570749316223 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('INSERT INTO t_company (id,name,description) VALUES (1,\'AdminCompany\',\'Company\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET COMPANIES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD COMPANIES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY COMPANIES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE COMPANIES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET PROFILES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY PROFILES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD PROFILES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE PROFILES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET GROUPS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD GROUPS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY GROUPS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE GROUPS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET USERS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD USERS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY USERS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE USERS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET AREAS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD AREAS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY AREAS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE AREAS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET ASSETS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD ASSETS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY ASSETS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE ASSETS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET AUDITS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD AUDITS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY AUDITS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE AUDITS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET DEPARTMENTS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD DEPARTMENTS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY DEPARTMENTS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE DEPARTMENTS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET EVIDENCES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD EVIDENCES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY EVIDENCES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE EVIDENCES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET INTEGRATIONS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD INTEGRATIONS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY INTEGRATIONS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE INTEGRATIONS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET RESPONSABLES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD RESPONSABLES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY RESPONSABLES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE RESPONSABLES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET TAGS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD TAGS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY TAGS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE TAGS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET URLS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD URLS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY URLS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE URLS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET VULNERABILITIES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD VULNERABILITIES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY VULNERABILITIES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE VULNERABILITIES\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'GET CREDENTIALS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'ADD CREDENTIALS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'MODIFY CREDENTIALS\')');
        await queryRunner.query('INSERT INTO t_functionality(name) VALUES (\'DELETE CREDENTIALS\')');
        await queryRunner.query("INSERT INTO t_functionality(name) VALUES ('GET METHODOLOGIES')");
        await queryRunner.query("INSERT INTO t_functionality(name) VALUES ('ADD METHODOLOGIES')");
        await queryRunner.query("INSERT INTO t_functionality(name) VALUES ('MODIFY METHODOLOGIES')");
        await queryRunner.query("INSERT INTO t_functionality(name) VALUES ('DELETE METHODOLOGIES')");
        await queryRunner.query('INSERT INTO t_profile(id,name) VALUES (1,\'Admin\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET CREDENTIALS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD CREDENTIALS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY CREDENTIALS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE CREDENTIALS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET COMPANIES\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD COMPANIES\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY COMPANIES\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE COMPANIES\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET PROFILES\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD PROFILES\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY PROFILES\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE PROFILES\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET GROUPS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD GROUPS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY GROUPS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE GROUPS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET USERS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD USERS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY USERS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE USERS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET AREAS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD AREAS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY AREAS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE AREAS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'GET DEPARTMENTS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'ADD DEPARTMENTS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'MODIFY DEPARTMENTS\')');
        await queryRunner.query('INSERT INTO t_profile_functionalities_functionality ("profileId","functionalityName") VALUES (1,\'DELETE DEPARTMENTS\')');
        await queryRunner.query('INSERT INTO t_group ("id","name","companyId") VALUES (1,\'adminGroup\',1)');
        await queryRunner.query('INSERT INTO t_user ("id","name","password","profileId")  VALUES (1,\'admin\',\'$2b$10$tAbdb181QxBl5aWXeChVk.nsDmdMFZ6Jv.LFnBgEtowVFg2AzPRc2\',1)');
        await queryRunner.query('INSERT INTO t_area ("id","name","companyId") VALUES (1,\'Area1\',1)');
        await queryRunner.query('INSERT INTO t_company_users_user ("companyId","userId") VALUES(1,1)');
        await queryRunner.query('ALTER SEQUENCE t_company_id_seq RESTART WITH 2');
        await queryRunner.query('ALTER SEQUENCE t_user_id_seq RESTART WITH 2');
        await queryRunner.query('ALTER SEQUENCE t_group_id_seq RESTART WITH 2');
        await queryRunner.query('ALTER SEQUENCE t_area_id_seq RESTART WITH 2');
        await queryRunner.query('ALTER SEQUENCE t_profile_id_seq RESTART WITH 2');


    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
