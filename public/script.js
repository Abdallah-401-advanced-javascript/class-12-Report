'use strict';
// require('dotenv').config();
let URL = 'https://www.linkedin.com/oauth/v2/authorization';
// const API_SERVER = process.env.API_SERVER;
let options = {
  response_type:'code',
  client_id:'77wcte95rcnlli',
  redirect_uri:'https://testmylocalstuff.herokuapp.com/oauth',
  scope:'r_liteprofile',
};
console.log(options);
let QueryString = Object.keys(options).map((key) => {
  return `${key}=` + encodeURIComponent(options[key]);
}).join('&');

let authURL = `${URL}?${QueryString}`;
console.log('@@@@@@@@@@@@@@@@@@@@@@',{authURL});

let link = document.getElementById('oauth');
link.setAttribute('href', authURL);