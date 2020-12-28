/**
 * 初始化滑动条
 */

const elBri = $("#paramBri").slider()
const elF = $("#paramF").slider()
const elSize = $("#paramSize").slider()

//色彩条相关元素
// const vibrationBar = document.querySelector(".vibration-color .color-bar")
const gravelBar = document.querySelector(".gravel-color .color-bar")
// const vibrationIndicator = document.querySelector(".vibration-indicator")
const gravelindicator = document.querySelector(".gravel-indicator")

// 径向分布控制
const originColor = document.querySelector("#originColor")
// const vibrationContainer = document.querySelector(".vibration-container")
const gravelContainer = document.querySelector(".gravel-container")

// 参数
const material = document.querySelector("#n")
const paramL = document.querySelector("#paramL")
const paramM = document.querySelector("#paramM")
const refreshBtn = document.querySelector(".refreshBtn")
var r = new Array();
var src = '';
var isFinish = false

    // $(".frequency").mouseover(()=>{
    //     console.log(1111)
    // })
    // $(".frequency").mouseover(() => {
    //     console.log("进来了")
    // })
    // $(".frequency").mouseleave(() => {
    //     console.log("出去了")
    // })
    /**
     * 设置滑动条初始值
     */
;(function () {
    elBri.slider('setValue', 20)  //亮度
    elSize.slider('setValue', 30) //尺寸

})()

function drawNow() {
    console.log('改变图')
    drawChladni(material.value, paramL.value, paramM.value)
}

// 主量子数改变
material.onchange = function () {
    console.log("主量子改变")
    var m = document.getElementById('paramL')
    var selectOptions = m.options
    var optionLength = selectOptions.length
    for (var i = 0; i < optionLength; i++) {
        m.removeChild(selectOptions[0]);
    }
    for (var i = 0; i < parseInt(material.value); i++) {
        m.innerHTML += "<option value='" + i + "'>l=" + i + "</option>"
    }
    drawNow()
}


paramL.onchange = function () {
    console.log("角量子改变")
    var m = document.getElementById('paramM')
    var selectOptions = m.options
    var optionLength = selectOptions.length
    for (var i = 0; i < optionLength; i++) {
        m.removeChild(selectOptions[0])
    }
    console.log("角量子改变")
    for (var i = -parseInt(paramL.value); i <= parseInt(paramL.value); i++) {

        m.innerHTML += "<option value='" + i + "'>m=" + i + "</option>"
    }
    drawNow()
}

paramM.onchange = function () {
    drawNow();
}


//图形绘制比例
var scale = 2
//初始绘制颜色
var bgColor = "white"
var chladniColor = "#d9ff69"

//缓存计算结果
var cache = null

//获取当前参数值
var currentParam = {
    n: material.value,
    l: paramL.value,
    m: paramM.value,
    size: elSize,
    bri: elBri,
}


//进行首次绘制
drawChladni(material.value, paramL.value, paramM.value)

//处理色彩条
let bgCurrentPosi = 0
let chladniCurrentPosi = 0
let vibrationInitialPosi = 63
let gravelInitialPosi = 33

//移动颜色选择指示器到初始位置
gravelindicator.style.left = `${gravelInitialPosi - 10}px`

//初始化颜色选择器颜色
getColor(gravelInitialPosi / gravelBar.offsetWidth, 'gravel')


// 色彩条点击
gravelBar.onclick = function (ev) {
    //修改相应值
    chladniCurrentPosi = ev.offsetX - gravelInitialPosi
    console.log(chladniCurrentPosi)
    //移动指示器位置
    gravelindicator.style.transform = `translateX(${ev.offsetX - gravelInitialPosi}PX)`

}
// 色彩条拖动
let startPosi = 0
let endPosi = 0
let currentPosi = 0
let displacement = 0

let isGravelIndicatorDown = false
let isGravelMouseOut = false
// let isGravelMove = falseassets
originColor.onchange = function () {

}

/**
 * 绘制图样
 * @param {*} bgColor      背景颜色
 * @param {*} chladniColor 克拉尼图样颜色
 * @param {*} isRefresh    是否强制重新计算
 */

function getValue(n, l, m) {
    eel.make_materx(n, l, m)
    eel.expose(result);

    function result(imgPath, rvalue) {
        src = imgPath
        r = rvalue
        console.log(src, r)
    }
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor('rgb(255,255,255)',1.0);
renderer.setSize(400,400);
document.getElementById('3d').appendChild(renderer.domElement);

//  画图
function drawChladni(n, l, m) {
    // var param = {
    //     n: material.value,
    //     l: paramL.value,
    //     m: paramM.value,
    //     size: elSize,
    //     bri: elBri,
    // }
    getValue(n, l, m)
    console.log(n, l, m)

    setTimeout(function () {
        //密度图
        var canvas = document.getElementById("Canvas")
        var ctx = canvas.getContext("2d")
        ctx.strokeStyle = "black"
        ctx.font = "24px Arial"

        ctx.fillText("密度图", 140, 370)
        var img = new Image()
        img.src = src
        img.onload = function () {
            // console.log(img)
            ctx.drawImage(img, 30, 30, 320, 320);
            ctx.beginPath();
            ctx.stroke();
        }

        var geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
        for (var i = 0; i < 91; i++) {
            for (var j = 0; j < 181; j++) {
                var a = new THREE.Vector3(r[0][i][j] * 100, r[1][i][j] * 100, r[2][i][j] * 100)
                // var a = new THREE.Vector3( i,j+1,j-1 );
                geometry.vertices.push(a)
            }
        }

        //如果以点的形式渲染，需要设置点对应材质
        var pointMaterial = new THREE.PointsMaterial({
            color: 0xD2691E,    //设置颜色，默认 0xFFFFFF
            vertexColors: false, //定义材料是否使用顶点颜色，默认false ---如果该选项设置为true，则color属性失效
            size: 1             //定义粒子的大小。默认为1.0
        });
        //生成点模型
        var cube = new THREE.Points(geometry, pointMaterial);

        scene.add(cube);
        camera.position.z = 120;
        var animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);

        };
        // renderer.render(scene, camera);
        animate();
        geometry.verticesNeedUpdate = true;
    }, 2000)


}


/**
 * 获取当前颜色值
 * @param {*} percent 当前位置在彩条上的百分比
 * @param {*} where 给哪个彩条绘制
 */
function getColor(percent, which) {
    let r = 255
    let g = 255
    let b = 255
    // console.log(percent)
    if (percent > 1) {
        return 'rgb(81,0,0)'
    }
    if (percent < 0) {
        return 'rgb(71,0,72)'
    }

    if (percent <= 0.045) {
        let curPer = (percent * 1000 / (0.1 * 1000))
        r = 71 + curPer * (109 - 71)
        g = 0 + curPer * (0 - 0)
        b = 72 + curPer * (152 - 72)
    } else if (percent <= 0.135 && percent > 0.045) {
        let curPer = ((percent - 0.045) * 1000 / ((0.135 - 0.045) * 1000))
        r = 109 - curPer * (109 - 31)
        g = 0 + curPer * (0 - 0)
        b = 152 + curPer * (255 - 152)
    } else if (percent <= 0.27 && percent > 0.135) {
        let curPer = ((percent - 0.135) * 1000 / ((0.27 - 0.135) * 1000))
        r = 31 - curPer * (31 - 0)
        g = 0 + curPer * (239 - 0)
        b = 255 + curPer * (255 - 255)
    } else if (percent <= 0.405 && percent > 0.27) {
        let curPer = ((percent - 0.27) * 1000 / ((0.405 - 0.27) * 1000))
        r = 0 + curPer * (109 - 0)
        g = 239 + curPer * (255 - 239)
        b = 255 - curPer * (255 - 0)
    } else if (percent <= 0.54 && percent > 0.405) {
        let curPer = ((percent - 0.405) * 1000 / ((0.54 - 0.405) * 1000))
        r = 109 + curPer * (255 - 109)
        g = 255 - curPer * (255 - 199)
        b = 0 - curPer * (0 - 0)
    } else if (percent <= 0.675 && percent > 0.54) {
        let curPer = ((percent - 0.54) * 1000 / ((0.675 - 0.54) * 1000))
        r = 255 - curPer * (255 - 252)
        g = 199 - curPer * (199 - 0)
        b = 0 - curPer * (0 - 0)
    } else if (percent <= 0.81 && percent > 0.675) {
        let curPer = ((percent - 0.675) * 1000 / ((0.81 - 0.675) * 1000))
        r = 252 - curPer * (252 - 180)
        g = 0 - curPer * (0 - 0)
        b = 0 - curPer * (0 - 0)
    } else if (percent <= 0.945 && percent > 0.81) {
        let curPer = ((percent - 0.81) * 1000 / ((0.945 - 0.81) * 1000))
        r = 180 - curPer * (180 - 110)
        g = 0 - curPer * (0 - 0)
        b = 0 - curPer * (0 - 0)
    } else if (percent <= 1 && percent > 0.945) {
        let curPer = ((percent - 0.945) * 1000 / ((1 - 0.945) * 1000))
        r = 110 - curPer * (110 - 81)
        g = 0 - curPer * (0 - 0)
        b = 0 - curPer * (0 - 0)
    }
    // indicator[0].style.borderLeftColor = `rgb(${r},${g},${b})`
    // indicator[0].style.borderLeftColor = `rgb(${r},${g},${b})`
    $(`.${which}-indicator-left`).css({
        "border-right-color": `rgb(${r},${g},${b})`,
        "border-bottom-color": `rgb(${r},${g},${b})`,

    })
    $(`.${which}-indicator-right`).css({
        "border-left-color": `rgb(${r},${g},${b})`,
        "border-bottom-color": `rgb(${r},${g},${b})`,

    })
    return `rgb(${r},${g},${b})`
}

//重置canvas绘图区域并绘图
// function resize() {
//     drawingBoard.width = window.innerWidth - 300;
//     drawingBoard.height = window.innerHeight - 80;
//     drawChladni(bgColor, chladniColor)
// }