import LibGenerateTestUserSig from './lib-generate-test-usersig-es.min.js';

const EXPIRETIME = 604800;

interface Options {
  SDKAppID: number;
  secretKey: string;
  userID: string;
}

interface UserSigResult {
  SDKAppID: number;
  userSig: string;
}

function genTestUserSig(options: Options): UserSigResult {
  const { SDKAppID, secretKey, userID } = options;
  const generator = new LibGenerateTestUserSig(SDKAppID, secretKey, EXPIRETIME);
  const userSig = generator.genTestUserSig(userID);
  return {
    SDKAppID,
    userSig,
  };
}

export { genTestUserSig, EXPIRETIME };