'use strict';

const superagent = require('superagent');
const users = require('./users.js');
console.log('hhhhhhhhhhhhhhhdsadsadddhhhhhh');
const { v4: uuidv4 } = require('uuid');
/*
  Resources
  https://developer.github.com/apps/building-oauth-apps/
*/

const tokenServerUrl = process.env.TOKEN_SERVER;
const remoteAPI = process.env.REMOTE_API;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;
console.log({tokenServerUrl});

module.exports = async  (req, res, next)=> {
  try {
    console.log('req.query', req.query);
    
    let code = req.query.code;
    console.log('(1) CODE:', code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) LinkedIn USER', remoteUser);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('(4) LOCAL USER', token);

    next();
  } catch (e) {
    console.log(`ERROR: ${e}`);
    next('error');
  }
};

/**
 * 
 * @param {string} code 
 */
async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl)
    .set('Content-Type','application/x-www-form-urlencoded')
    .send({
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: API_SERVER,
      grant_type: 'authorization_code',
    });

  let access_token = tokenResponse.body.access_token;
  console.log('returned token',access_token);
  return access_token;
}

/**
 * 
 * @param {string} token 
 */
async function getRemoteUserInfo(token) {
  console.log('HELLLLLO',token);
  let userResponse = await superagent
    .get(remoteAPI)
    .set('Authorization',` Bearer ${token}`);
  let user = userResponse.body;
  return user;
}

/**
 * 
 * @param {obj} remoteUser 
 */
async function getUser(remoteUser) {
  let username= remoteUser.localizedFirstName+remoteUser.localizedLastName;
  let userRecord = {
    username: username,
    password: uuidv4(),
  };
  // let user = await users.save(userRecord);
  users.userRecord = userRecord;
  let token = users.generateToken(userRecord);
  return [username, token];

}