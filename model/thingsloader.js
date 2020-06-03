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
            title: 'Bewaesserung 2 [54]',
            icon: 'assets/svg/sym_lamp.svg',
            topics: {
                tpcBase: 'Hof/Garten/BW_SHP5_54',
                tpcTeleSensor: 'Hof/Garten/BW_SHP5_54/tele/SENSOR',
                tpcTeleState: 'Hof/Garten/BW_SHP5_54/tele/STATE',
                tpcStatPower1: 'Hof/Garten/BW_SHP5_54/stat/POWER1',
                tpcCommandPower1: 'Hof/Garten/BW_SHP5_54/cmnd/POWER1'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [4],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 0,
                        cfgcsTo: 1,
                        cfgcsName: 'Eingeschaltet',
                        cfgcsColor: 'csred'
                    },
                    {
                        cfgcsFrom: 1,
                        cfgcsTo: 0,
                        cfgcsName: 'Ausgeschaltet',
                        cfgcsColor: 'csnone'
                    }
                ],
                cfgSwitchAllowed: 1,
                cfgAutoSwitchOff: 0
            }
        }
    ),
    new ThingTasmota(
        {
            id: 2,
            name: 'Sonoff_43',
            title: 'Marie Fernseher [43]',
            icon: 'assets/svg/sym_tv.svg',
            topics: {
                tpcBase: 'Haus/OG/Marie/Sonoff43',
                tpcTeleSensor: 'Haus/OG/Marie/Sonoff43/tele/SENSOR',
                tpcTeleState: 'Haus/OG/Marie/Sonoff43/tele/STATE',
                tpcStatPower1: 'Haus/OG/Marie/Sonoff43/stat/POWER1',
                tpcCommandPower1: 'Haus/OG/Marie/Sonoff43/cmnd/POWER1'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [1,10],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: -1,
                        cfgcsTo: 2,
                        cfgcsName: 'Eingeschaltet',
                        cfgcsColor: 'csblue'
                    },
                    {
                        cfgcsFrom: -1,
                        cfgcsTo: 1,
                        cfgcsName: 'Standby',
                        cfgcsColor: 'csred'
                    },
                    {
                        cfgcsFrom: -1,
                        cfgcsTo: 0,
                        cfgcsName: 'Ausgeschaltet',
                        cfgcsColor: 'cswhite'
                    }
                ],
                cfgSwitchAllowed: 1,
                cfgAutoSwitchOff: 0
            }
        }
    ),
    new ThingTasmota(
        {
            id: 3,
            name: 'Sonoff_50',
            title: 'TV Wohnzimmer [50]',
            icon: 'assets/svg/sym_tv.svg',
            topics: {
                tpcBase: 'Haus/OG/WZ/Sonoff50',
                tpcTeleSensor: 'Haus/OG/WZ/Sonoff50/tele/SENSOR',
                tpcTeleState: 'Haus/OG/WZ/Sonoff50/tele/STATE',
                tpcStatPower1: 'Haus/OG/WZ/Sonoff50/stat/POWER',
                tpcCommandPower1: 'Haus/OG/WZ/Sonoff50/cmnd/POWER'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [1,10],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: -1,
                        cfgcsTo: 2,
                        cfgcsName: 'Eingeschaltet',
                        cfgcsColor: 'csgreen'
                    },
                    {
                        cfgcsFrom: -1, // egal von wo kommend
                        cfgcsTo: 1,
                        cfgcsName: 'Standby',
                        cfgcsColor: 'csyellow'
                    },
                    {
                        cfgcsFrom: -1, // egal von wo kommend
                        cfgcsTo: 0,
                        cfgcsName: 'Ausgeschaltet',
                        cfgcsColor: 'cswhite'
                    }
                ],
                cfgSwitchAllowed: 1,
                cfgAutoSwitchOff: 0
            }
        }
    ),
    new ThingTasmota(
        {
            id: 4,
            name: 'BW_SHP_53',
            title: 'Bewaesserung 1 [53]',
            icon: 'assets/svg/sym_power.svg',
            topics: {
                tpcBase: 'Hof/Garten/BW_SHP5_53',
                tpcTeleSensor: 'Hof/Garten/BW_SHP5_53/tele/SENSOR',
                tpcTeleState: 'Hof/Garten/BW_SHP5_53/tele/STATE',
                tpcStatPower1: 'Hof/Garten/BW_SHP5_53/stat/POWER1',
                tpcCommandPower1: 'Hof/Garten/BW_SHP5_53/cmnd/POWER1'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [4],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 0,
                        cfgcsTo: 1,
                        cfgcsName: 'Eingeschaltet',
                        cfgcsColor: 'csred'
                    },
                    {
                        cfgcsFrom: 1,
                        cfgcsTo: 0,
                        cfgcsName: 'Ausgeschaltet',
                        cfgcsColor: 'csnone'
                    }
                ],
                cfgSwitchAllowed: 1,
                cfgAutoSwitchOff: 0
            }
        }
    ),
    new ThingTasmota(
        {
            id: 5,
            name: 'Teckin_58',
            title: 'Waschmaschine [58]',
            icon: 'assets/svg/sym_wash.svg',
            topics: {
                tpcBase: 'Haus/EG/HWR/Teckin58',
                tpcTeleSensor: 'Haus/EG/HWR/Teckin58/tele/SENSOR',
                tpcTeleState: 'Haus/EG/HWR/Teckin58/tele/STATE',
                tpcStatPower1: 'Haus/EG/HWR/Teckin58/stat/POWER',
                tpcCommandPower1: 'Haus/EG/HWR/Teckin58/cmnd/POWER'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [1,30],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 0,
                        cfgcsTo: 1,
                        cfgcsName: 'bereit',
                        cfgcsColor: 'csblue'
                    },
                    {
                        cfgcsFrom: 1,
                        cfgcsTo: 2,
                        cfgcsName: 'läuft',
                        cfgcsColor: 'csgreen'
                    },
                    {
                        cfgcsFrom: 2,
                        cfgcsTo: 1,
                        cfgcsName: 'fertig',
                        cfgcsColor: 'csred'
                    }
                ],
                cfgSwitchAllowed: 0,
                cfgAutoSwitchOff: 0
            }
        }
    ),
    new ThingTasmota(
        {
            id: 6,
            name: 'Teckin_55',
            title: 'Spuelmaschine [55]',
            icon: 'assets/svg/sym_wash.svg',
            topics: {
                tpcBase: 'Haus/OG/Kueche/Teckin55',
                tpcTeleSensor: 'Haus/OG/Kueche/Teckin55/tele/SENSOR',
                tpcTeleState: 'Haus/OG/Kueche/Teckin55/tele/STATE',
                tpcStatPower1: 'Haus/OG/Kueche/Teckin55/stat/POWER',
                tpcCommandPower1: 'Haus/OG/Kueche/Teckin55/cmnd/POWER'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [10],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 0,
                        cfgcsTo: 1,
                        cfgcsName: 'eingeschaltet',
                        cfgcsColor: 'csblue'
                    },
                    {
                        cfgcsFrom: 1,
                        cfgcsTo: 0,
                        cfgcsName: 'ausgeschaltet',
                        cfgcsColor: 'cswhite'
                    }
                ],
                cfgSwitchAllowed: 0,
                cfgAutoSwitchOff: 0
            }
        }
    ),
    new ThingTasmota(
        {
            id: 7,
            name: 'Teckin_57',
            title: 'Kuehlschrank EG [57]',
            icon: 'assets/svg/sym_power.svg',
            topics: {
                tpcBase: 'Haus/EG/ASR/Teckin57',
                tpcTeleSensor: 'Haus/EG/ASR/Teckin57/tele/SENSOR',
                tpcTeleState: 'Haus/EG/ASR/Teckin57/tele/STATE',
                tpcStatPower1: 'Haus/EG/ASR/Teckin57/stat/POWER',
                tpcCommandPower1: 'Haus/EG/ASR/Teckin57/cmnd/POWER'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [10],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 0,
                        cfgcsTo: 1,
                        cfgcsName: 'eingeschaltet',
                        cfgcsColor: 'csblue'
                    },
                    {
                        cfgcsFrom: 1,
                        cfgcsTo: 0,
                        cfgcsName: 'ausgeschaltet',
                        cfgcsColor: 'csnone'
                    }
                ],
                cfgSwitchAllowed: 0,
                cfgAutoSwitchOff: 0
            }
        }
    ),
    new ThingTasmota(
        {
            id: 8,
            name: 'Sonoff_52',
            title: 'Trockner [52]',
            icon: 'assets/svg/sym_wash.svg',
            topics: {
                tpcBase: 'Haus/EG/HWR/Sonoff52',
                tpcTeleSensor: 'Haus/EG/HWR/Sonoff52/tele/SENSOR',
                tpcTeleState: 'Haus/EG/HWR/Sonoff52/tele/STATE',
                tpcStatPower1: 'Haus/EG/HWR/Sonoff52/stat/POWER',
                tpcCommandPower1: 'Haus/EG/HWR/Sonoff52/cmnd/POWER'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [1,15],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 0,
                        cfgcsTo: 1,
                        cfgcsName: 'bereit',
                        cfgcsColor: 'cswhite'
                    },
                    {
                        cfgcsFrom: 1,
                        cfgcsTo: 2,
                        cfgcsName: 'eingeschaltet',
                        cfgcsColor: 'csblue'
                    },
                    {
                        cfgcsFrom: 2,
                        cfgcsTo: 1,
                        cfgcsName: 'fertig',
                        cfgcsColor: 'csred'
                    },
                    {
                        cfgcsFrom: -1,
                        cfgcsTo: 0,
                        cfgcsName: 'ausgeschaltet',
                        cfgcsColor: 'csnone'
                    }
                ],
                cfgSwitchAllowed: 0,
                cfgAutoSwitchOff: 0
            }
        }
    ),
    new ThingTasmota(
        {
            id: 9,
            name: 'Sonoff_44',
            title: 'Lampe Wohnz. [44]',
            icon: 'assets/svg/sym_lamp.svg',
            topics: {
                tpcBase: 'Haus/OG/WZ/Sonoff44',
                tpcTeleSensor: 'Haus/OG/WZ/Sonoff44/tele/SENSOR',
                tpcTeleState: 'Haus/OG/WZ/Sonoff44/tele/STATE',
                tpcStatPower1: 'Haus/OG/WZ/Sonoff44/stat/POWER',
                tpcCommandPower1: 'Haus/OG/WZ/Sonoff44/cmnd/POWER'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [10],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 0,
                        cfgcsTo: 1,
                        cfgcsName: 'eingeschaltet',
                        cfgcsColor: 'csblue'
                    },
                    {
                        cfgcsFrom: 1,
                        cfgcsTo: 0,
                        cfgcsName: 'ausgeschaltet',
                        cfgcsColor: 'csgreen'
                    }
                ],
                cfgSwitchAllowed: 1,
                cfgAutoSwitchOff: 0
            }
        }
    ),
    new ThingTasmota(
        {
            id: 10,
            name: 'Sonoff_42',
            title: 'Amelie Echo [42]',
            icon: 'assets/svg/sym_power.svg',
            topics: {
                tpcBase: 'Haus/OG/Amy/Sonoff42',
                tpcTeleSensor: 'Haus/OG/Amy/Sonoff42/tele/SENSOR',
                tpcTeleState: 'Haus/OG/Amy/Sonoff42/tele/STATE',
                tpcStatPower1: 'Haus/OG/Amy/Sonoff42/stat/POWER',
                tpcCommandPower1: 'Haus/OG/Amy/Sonoff42/cmnd/POWER'
            },
            config: {
                cfgConsumerLevelRepeat: 4,
                cfgConsumerLevel: [10],
                cfgConsumerStatus: [
                    {
                        cfgcsFrom: 0,
                        cfgcsTo: 1,
                        cfgcsName: 'eingeschaltet',
                        cfgcsColor: 'csblue'
                    },
                    {
                        cfgcsFrom: -1,
                        cfgcsTo: 0,
                        cfgcsName: 'ausgeschaltet',
                        cfgcsColor: 'cswhite'
                    }
                ],
                cfgSwitchAllowed: 1,
                cfgAutoSwitchOff: 0
            }
        }
    )
]

module.exports = thingsloader;

