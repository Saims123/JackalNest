import {
    cleanEnv, str,
  } from 'envalid';
   
  export default function validateEnv() {
    cleanEnv(process.env, {
      MONGO_PASSWORD: str(),
      MONGO_PATH: str(),
      MONGO_USER: str(),
    });
  }