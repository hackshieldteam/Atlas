import 'reflect-metadata';
import 'dotenv/config';
import { createConnection } from 'typeorm';
import config from './ormconfig';
import CompanyController from './routes/companies/company.controller';
import AuthenticationController from './routes/authentication/authentication.controller';
import UserController from './routes/users/user.controller';
import ProfileController from './routes/profiles/profile.controller';
import validateEnv from './utils/validateEnv'
import App from './app';
import GroupController from './routes/groups/group.controller';
import AreaController from './routes/areas/area.controller';
import AssetController from './routes/assets/asset.controller'
import DepartmentController from './routes/departments/department.controller';
import AuditController from './routes/audits/audit.controller';
import IntegrationController from './routes/integrations/integration.controller';
import ResponsableController from './routes/responsables/responsable.controller';
import TagController from './routes/tags/tag.controller';
import UrlController from './routes/urls/url.controller';
import VulnerabilityController from './routes/vulnerabilities/vulnerability.controller';
import EvidenceController from './routes/evidences/evidence.controller';
import MethodologyController from './routes/methodologies/methodology.controller';
import JiraController from './routes/jira/jira.controller';
import KnowledgeBaseController from './routes/knowledgeBase/knowledgeBase.controller';
import TestController from './routes/tests/test.controller';
import CredentialController from './routes/credentials/credentials.controller';

validateEnv();



(async () => {
  try {
    const connection = await createConnection(config);
    await connection.runMigrations()

  } catch (error) {
    console.log("Error connecting to the database", error)
    return error;
  }
  const app = new App(
    [
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
      new JiraController(),
      new TestController(),
      new CredentialController()

    ]
  );

  app.listen()
})();

