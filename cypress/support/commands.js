Cypress.Commands.add('startZapScan', () => {
    const zapApiUrl = 'http://localhost:8090'; 
    const apiKey = 'Ki069f4ht44jmvcv5bbka13sjp'; 
    const targetUrl = 'http://localhost:3000'
  
    cy.request({
      method: 'POST',

      url: `${zapApiUrl}/JSON/ascan/action/scan/?apikey=${apiKey}&url=${targetUrl}&recurse=true&inScopeOnly=false&scanPolicyName=&method=GET&postData=&contextId=`
    }).then(response => {
      expect(response.status).to.eq(200);
      cy.log('ZAP Scan démarré :', response.body);
    });
  });
  
