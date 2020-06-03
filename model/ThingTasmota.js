
module.exports = function ThingTasmota(param) {
    this.id = param.id;
    this.name = param.name;
    this.title = param.title;
    this.icon = param.icon;
    this.topics = param.topics;
    this.config = param.config;
    this.currentData = {
        curPower: 0,
        curVoltage: 0,
        curConsPowerLevel: 0,
        curConsPowerState: 0,
        curConsPowerStateTitle: '',
        curState: 'OFF'
    }
    this.tileData = {
        id: this.id,
        title: this.title,
        icon: this.icon,
        consumerState: 0,
        consumerStateColor: 'csnone',
        consumerStateTitle: '',
        consumerLevel: 0,
        infoText1: 'Power: <strong>Off</strong>',
        infoText2: '- leer -',
        state: "Off",
        power: 0,
        totalPower: 0,
        prevDayPower: 0,
        dataChart: {
            chartTimes: [0],
            chartPower: [0],
            chartTotal: [0],
            chartPrev: [0]       
        }
    };
    this.dataSensor = [];
    this.dataState = [];
    this.dataCommandPower = [];
    this.dataConsumerState = [];
    this.saveTeleSensor = function(telSens) {
        this.dataSensor.push(telSens);
        this.currentData.curPower = telSens.curPower;
        this.tileData.power = telSens.curPower;
        this.tileData.totalPower = telSens.totPower;
        this.tileData.prevDayPower = telSens.prevDay;
        this.tileData.infoText1 = 'Power: <strong>' + this.currentData.curPower + ' W</strong>';
        this.evaluateLevel();
        this.evaluateChart();
    }
    this.saveTeleState = function(telState) {
        this.dataState.push(telState);
        this.currentData.curState = telState.state;
        this.tileData.state = telState.state;
    }
    this.saveStatPower = function(stPwr) {
        this.dataState.push(stPwr);
        this.currentData.curState = stPwr.state;
        this.tileData.state = stPwr.state;
    }
    this.evaluateLevel = function(){
        var i = this.dataSensor.length - 1;
        var sameLevel = true;               // gilt für PwrLev
        var prevPwrLev = 0, curPwrLev = 0;  // PwrLev: konkret pro Eintrag im Array
        var prevConLev = 0;                 // 
        if(this.dataSensor.length > 1) prevConLev = this.dataSensor[i-1].consumerPowerLevel;
        var curConLev = prevConLev;
        while(i >= 0 && i >= this.dataSensor.length-this.config.cfgConsumerLevelRepeat-1 && sameLevel) {
            for(var j = 0; j <= this.config.cfgConsumerLevel.length; j++) {
                if(this.dataSensor[i].curPower > this.config.cfgConsumerLevel[j]) curPwrLev++;
            }
            if(i < this.dataSensor.length-1) {
                if(prevPwrLev != curPwrLev) {
                    sameLevel = false;
                    curConLev = prevConLev;
                }
            }
            prevPwrLev = curPwrLev;
            i--;
        }
        if(sameLevel) curConLev = curPwrLev;
        this.dataSensor[this.dataSensor.length - 1].consumerPowerLevel = curConLev;
        this.currentData.curConsPowerLevel = curConLev;
        this.tileData.consumerLevel = curConLev;
        for(var k = 0; k < this.config.cfgConsumerStatus.length; k++) {
            if((this.config.cfgConsumerStatus[k].cfgcsFrom == prevConLev || this.config.cfgConsumerStatus[k].cfgcsFrom == -1) && this.config.cfgConsumerStatus[k].cfgcsTo == curConLev) {
                this.currentData.curConsPowerState = k;
                this.currentData.curConsPowerStateTitle = this.config.cfgConsumerStatus[k].cfgcsName;
                this.tileData.consumerState = k;
                this.tileData.consumerStateColor = this.config.cfgConsumerStatus[k].cfgcsColor;
                this.tileData.consumerStateTitle = this.config.cfgConsumerStatus[k].cfgcsName;
                this.tileData.infoText1 = 'Power: <strong>' + this.currentData.curPower + ' W</strong>';
                this.tileData.infoText2 = 'V-Status: <strong>' + this.tileData.consumerStateTitle + '</strong>';
            }
        }
    }
    this.evaluateChart = function() {
        var i = this.dataSensor.length-1;
        var startTime = this.dataSensor[i].timeStamp.toString().slice(11, 16);
        var val = [];
        var avg = 0;
        var fin = false;
        while(!fin) {
            var curTime = this.dataSensor[i].timeStamp.toString().slice(11, 16);
            if (startTime == curTime) {
                val.push(this.dataSensor[i].curPower)
            } else {
                fin = true;
            }
            i--;
            if(i < 0) fin = true;
        }
        if(val.length > 2) {
            var valmax=0, valmin=9999999;
            var valmaxindex, valminindex;
            for(var j = 0; j < val.length; j++) {
                if(val[j] > valmax) {
                    valmax = val[j];
                    valmaxindex = j;
                }
                if(val[j] < valmin) {
                    valmin = val[j];
                    valminindex = j;
                }
            }
            if(valminindex > valmaxindex) val.splice(valminindex,1).splice(valmaxindex,1); 
                else val.splice(valmaxindex,1).splice(valminindex,1);
        }
        var sum = 0;
        for(var k = 0; k < val.length; k++) {
            sum += parseInt(val[k]);
        }
        avg = Math.round(sum / val.length);
        if(this.tileData.dataChart.chartTimes[this.tileData.dataChart.chartTimes.length-1] == startTime) {
            this.tileData.dataChart.chartPower[this.tileData.dataChart.chartTimes.length-1] = avg;
            this.tileData.dataChart.chartTotal[this.tileData.dataChart.chartTimes.length-1] = this.dataSensor[this.dataSensor.length-1].totPower;
            this.tileData.dataChart.chartPrev[this.tileData.dataChart.chartTimes.length-1] = this.dataSensor[this.dataSensor.length-1].prevDay;
        } else {
            this.tileData.dataChart.chartTimes.push(startTime);
            this.tileData.dataChart.chartPower.push(avg);
            this.tileData.dataChart.chartTotal.push(this.dataSensor[this.dataSensor.length-1].totPower);
            this.tileData.dataChart.chartPrev.push(this.dataSensor[this.dataSensor.length-1].prevDay);
            if(this.tileData.dataChart.chartTimes.length > 2880) this.tileData.dataChart.chartTimes.splice(0,this.tileData.dataChart.chartTimes.length - 2880);
            if(this.tileData.dataChart.chartPower.length > 2880) this.tileData.dataChart.chartPower.splice(0,this.tileData.dataChart.chartPower.length - 2880);
            if(this.tileData.dataChart.chartTotal.length > 2880) this.tileData.dataChart.chartTotal.splice(0,this.tileData.dataChart.chartTotal.length - 2880);
            if(this.tileData.dataChart.chartPrev.length > 2880) this.tileData.dataChart.chartPrev.splice(0,this.tileData.dataChart.chartPrev.length - 2880);
        }
    }
};
