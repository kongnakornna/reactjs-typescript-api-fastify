import app from './app'
const packageJSON = require('../package.json')
//console.log('NODE_ENV', process.env);
let port_main: any = (packageJSON.port);  
const IP = require('ip');
var start = async () => {
  try {
        await app.listen(port_main, '0.0.0.0')
        const ipAddress = IP.address();
        console.log('App ipaddress :' + ipAddress); 
        console.warn('App port :' + port_main); 
        console.log('App :' + app); 
        console.log('App Register :' + app.register); 
        console.log(`App is running at port ${port_main} at ${new Date()}`, process.env.PORT);
  } catch (err) {
        if (err) throw err  
        app.log.error(err)
        console.log('error :' +err)
        process.exit(1)
  }
}
start()