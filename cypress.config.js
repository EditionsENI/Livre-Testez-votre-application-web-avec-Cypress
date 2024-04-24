const { defineConfig } = require("cypress");
const ms = require('smtp-tester')
const { lighthouse, prepareAudit } = require('cypress-audit');

module.exports = defineConfig({
  projectId: "",
  env: {
    login_url: "/login",
    api_url: "http://localhost:3000",
    api_key: "secret_api_key"
  },
  e2e: {
    experimentalStudio: true,
    specPattern: 'cypress/e2e/**/*.*',
    proxyServer: 'http://localhost:8090',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    },
    setupNodeEvents(on, config) {
      const port = 7777;
      const mailServer = ms.init(port);
      let emails = []; 
  
      mailServer.bind((addr, id, email) => {
        console.log('--- email ---');
        console.log(addr, id, email);
        emails.push(email.html || email.body); 
      });

      on('before:browser:launch', (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on('task', {
        lighthouse: lighthouse(),
        getEmails() {
          const capturedEmails = [...emails]; 
          emails = []; 
          return capturedEmails; 
        },
      });
    },
  },  
});
