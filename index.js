const fs = require("fs");
var configFile = fs.readFileSync("config.json");
var conf = JSON.parse(configFile);

const NefitEasyCommands = require('nefit-easy-commands');
const nefit             = NefitEasyCommands({
  serialNumber   : conf.homeNefit.serialNumber,
  accessKey      : conf.homeNefit.accessKey,
  password       : conf.homeNefit.password
});

nefit.connect()
    .then(() => {
        return Promise.all([ nefit.status(), nefit.pressure() ]);
    })
    .then(([ status, pressure ]) => {
        console.log(
            'Temperature is set to %s°C, current is %s°C.\n' +
            'Outside temperature is %s°C.\n' +
            'System pressure is %s %s.',
            status['temp setpoint'].toFixed(1),
            status['in house temp'].toFixed(1),
            status['outdoor temp'].toFixed(1),
            pressure.pressure,
            pressure.unit
        );
    })
    .catch((e) => {
        console.error('error', e)
    })
    .finally(() => {
        nefit.end();
    });
