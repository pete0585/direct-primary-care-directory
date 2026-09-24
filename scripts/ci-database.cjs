// CI-only empty database fixture. Never deployed as a production data source.
const http = require('node:http');
if (process.env.AIDAM_CI_FIXTURE !== '1') throw new Error('Explicit CI fixture mode required');
http.createServer((req,res) => {
 if (!['GET','HEAD'].includes(req.method) || !req.url.startsWith('/rest/v1/')) {
  res.writeHead(405,{'Content-Type':'application/json'});return res.end(JSON.stringify({message:'CI database fixture is read-only'}));
 }
 res.writeHead(200,{'Content-Type':'application/json','Content-Range':'*/0','Access-Control-Expose-Headers':'Content-Range'});
 res.end(req.method === 'HEAD' ? '' : '[]');
}).listen(8765,'127.0.0.1');
