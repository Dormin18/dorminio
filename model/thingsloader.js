// ThingTasmota = require('./thingTasmota');
// const { sqlConnection } = require("./index");
var TeleSensor = require('./TeleSensor');
var ThingTasmota = require('./ThingTasmota');
var thingsloader = {};

thingsloader.things = 
[
    new ThingTasmota(
        {
            id: 1,
            name: 'BW_SHP5_54',
            title: 'BW_SHP5_54',
            icon: 'assets/svg/sym_lamp.svg',
            topics: {
                tpcBase: 'Haus/Test/BW_SHP5_54',
                tpcTeleSensor: 'Haus/Test/BW_SHP5_54/tele/SENSOR',
                tpcTteleState: 'Haus/Test/BW_SHP5_54/tele/STATE',
                tpcCommandPower1: 'Haus/Test/BW_SHP5_54/cmnd/POWER1'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [0,20,90],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 1,
                        cfgcsTo: 2,
                        cfgcsName: 'Eingeschaltet',
                        cfgcsColor: 'csgreen'
                    },
                    {
                        cfgcsFrom: 0,
                        cfgcsTo: 1,
                        cfgcsName: 'Ausgeschaltet',
                        cfgcsColor: 'csred'
                    }
                ]
            }
        }
    ),
    new ThingTasmota(
        {
            id: 2,
            name: 'Sonoff_43',
            title: 'Marie Fernseher',
            icon: 'assets/svg/sym_tv.svg',
            topics: {
                tpcBase: 'Haus/OG/Marie/Sonoff43',
                tpcTeleSensor: 'Haus/OG/Marie/Sonoff43/tele/SENSOR',
                tpcTteleState: 'Haus/OG/Marie/Sonoff43/tele/STATE',
                tpcCommandPower1: 'Haus/OG/Marie/Sonoff43/cmnd/POWER1'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [0,1,20,100],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 1,
                        cfgcsTo: 2,
                        cfgcsName: 'Eingeschaltet',
                        cfgcsColor: 'csgreen'
                    },
                    {
                        cfgcsFrom: 2,
                        cfgcsTo: 1,
                        cfgcsName: 'Ausgeschaltet',
                        cfgcsColor: 'csred'
                    }
                ]
            }
        }
    )    
]

module.exports = thingsloader;

