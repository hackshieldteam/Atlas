import {
    cleanEnv, str, num,
  } from 'envalid';
   
  function validateEnv() {
    cleanEnv(process.env, {
      DB_PASSWORD: str(),
      DB_PORT: num(),
      DB_HOST: str(),
      DB_USER: str(),
      DB_DATABASE: str(),
      TEST_DB_USER: str(),
      TEST_DB_DATABASE: str(),
      JWT_SECRET: str(),
      TEST_DB_PASSWORD: str(),
      PORT: num(),
    });
  }

  export default validateEnv;