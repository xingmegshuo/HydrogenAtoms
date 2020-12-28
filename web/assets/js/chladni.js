
// 整体策略：
// 1. 确定几何尺寸，计算特征频率对应图样
// 2. 根据具体f计算与特征频率距离，合成对应图样
var AllFrequency = []

function prepare(a,b,x, y, f, cc) {
    AllFrequency = []

    x=Math.ceil(x)+1
    y=Math.ceil(y)+1

    var xposi = new Array(x);
    var yposi = new Array(x);
    for (var i = 0; i < x; i++) {
        xposi[i] = new Array(y);
        yposi[i] = new Array(y);
        for (var j = 0; j < y; j++) {
            xposi[i][j] = j *x / 1000 / 100;
            yposi[i][j] = i *y / 1000 / 100;
        }
    }
    var zeroarray = new Array(y).fill(0)
    
    var fdic = {};
    
    for (var n = 0; n < 30; n+=2){
		for (var m = 0; m < 30; m+=2){		
			let p1 = n / a * 1000;
			let p2 = m / b * 1000;
			let ff = Math.round(3.14159 * cc  / 2 * (p1 * p1 + p2 * p2)).toString();
            if ((ff > 1e4)||ff==="0"){continue}
            if (ff in fdic){
				fdic[ff][0].push([n,m]);
			}
			else{
				fdic[ff] = [[[n,m]], null];
            }
		}
    }
    AllFrequency = Object.keys(fdic)
    var p1 = 0;
    for (var tempf in fdic) {
        fdic[tempf][1] = new Array(x+1);

        let coe = new Array();
        for (let k = 0; k < fdic[tempf][0].length; k++) {
            coe.push(Math.random() - 0.5);
        }
        let vmax = 0;
        
        for (i = 0; i < x; i++) {
            fdic[tempf][1][i] = Array.from(zeroarray)
            for (j = 0; j < y; j++) {
                //console.log(fdic[tempf][0])
                for (var k = 0; k < fdic[tempf][0].length; k++) {
                    n = fdic[tempf][0][k][0];
                    m = fdic[tempf][0][k][1];
                    p1 = Math.cos(m * 3.14159 * yposi[i][j] / y * 1000) * Math.cos(n * 3.14159 * xposi[i][j] / x * 1000) / fdic[tempf][0].length / 2;
                    fdic[tempf][1][i][j] += p1 * coe[k];
                }
                fdic[tempf][1][i][j] = Math.abs(fdic[tempf][1][i][j]);
                
                vmax = fdic[tempf][1][i][j] > vmax ? fdic[tempf][1][i][j] : vmax;
            }
            
        }
        for (i = 0; i < x; i++) {
            for (j = 0; j < y; j++) {
                fdic[tempf][1][i][j] /= vmax;
            }
        }
    }
    //console.timeEnd("A")
    //f = oldf;
    // 计算频率f对应的图样 对应二维矩阵zvalue
    // 调用draw画图
    //console.time("B")
    var disf = {};
    var tempdisf = 0;
    var sumdisf = 0;
    for (tempf in fdic) {
        tempdisf = 1 / Math.abs(tempf - f + 1e-10);
        disf[tempf] = tempdisf;
        sumdisf += tempdisf;
    }
    //console.log(disf)
    for (tempf in disf) {
        disf[tempf] /= sumdisf;
        //console.log(tempf)
    }
    //console.log(disf)
    var zvalue = Array(x);
    for (i = 0; i < x; i++) {
        zvalue[i] = Array(y);
        for (j = 0; j < y; j++) {
            zvalue[i][j] = 0;
            for (tempf in disf) {
                zvalue[i][j] += fdic[tempf][1][i][j] * disf[tempf];
                //console.log(tempf, fdic[tempf][1][i][j], disf[tempf])
            }
            //console.log(disf[tempf])
        }
    }
    
    for(i = 0; i < x; i++){
		for(j = 0; j < y; j++){
            let v = Math.round(zvalue[i][j]*10)/10;
            v = v>0.08?1:0
            zvalue[i][j] = v
        }
    }
    console.log(zvalue)
    //console.timeEnd("B")
    return zvalue;
}
