
module.exports = function ThingTasmota(param) {
    this.id = param.id;
    this.name = param.name;
    this.title = param.title;
    this.icon = param.icon;
    this.topics = param.topics;
    this.config = param.config;
    this.currentData = {
        power: 0,
        voltage: 0,
        consumPowerLevel: 0
    }
    this.tileData = {
        id: this.id,
        title: this.title,
        icon: this.icon,
        consumerState: 0,
        consumerStateColor: 'csnone',
        infoText1: 'Power: <strong>Off</strong>',
        infoText2: '- leer -',
        state: "Off",
        power: 0        
    };
    this.dataSensor = [];
    this.dataState = [];
    this.dataCommandPower = [];
    this.dataConsumerState = [];
    this.saveTeleSensor = function(telSens) {
        this.dataSensor.push(telSens);
        this.currentData.power=telSens.curPower;
        this.tileData.power=this.currentData.power;
        this.evaluateLevel();
    }
    this.saveTeleState = function(telState) {
        this.dataState.push(telState);
    }
    this.evaluateLevel = function(){
        var i = this.dataSensor.length - 1;
        var sameLevel = true;
        var prevPwrLev = 0, curPwrLev = 0;
        var prevConLev = 0;
        if(this.dataSensor.length > 1) this.dataSensor[i-1].consumerPowerLevel;
        var curConLev = 0;
        while(i >= 0 && i >= this.dataSensor.length-this.config.cfgConsumerLevelRepeat-1 && sameLevel) {
            for(var j = 0; j >= this.config.cfgConsumerLevel.length; j++) {
                if(this.dataSensor[i].power > this.config.cfgConsumerLevel[j]) curPwrLev++;
            }
            if(i <= this.dataSensor.length) {
                if(prevPwrLev != curPwrLev) {
                    sameLevel = false;
                    curConLev = prevConLev;
                }
            }
            prevPwrLev = curPwrLev;
        }
        if(sameLevel) curConLev = curPwrLev;
        this.dataSensor[this.dataSensor.length - 1].consumerPowerLevel = curPwrLev;
    }
};
