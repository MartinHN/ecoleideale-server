
const cfg={
  serverURL:"http://localhost:3000",
  siteURL:"http://localhost:8080",
  mongodb_url:"mongodb://localhost/ecoleideale",
  useLocalCors:true,
}

cfg['CORSList'] = [cfg.siteURL,cfg.serverURL,]//'https://ecoleideale.netlify.com'
module.exports=cfg;