var knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'atlas',
      password : 'pass',
      database : 'atlas_test'
    }
  });

knex('t_asset')
.join('t_audit', 't_asset.id','=','t_audit.assetId')
.join('t_vulnerability','t_vulnerability.auditId','=','t_audit.id')
.then( (rows) => console.log(rows))