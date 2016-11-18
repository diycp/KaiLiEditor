// 载入electron模块
const electron = require("electron");
// 创建应用程序对象
const app = electron.app;
const ipcMain = require('electron').ipcMain;

var globalShortcut = electron.globalShortcut;
// 创建一个浏览器窗口，主要用来加载HTML页面
const BrowserWindow = electron.BrowserWindow;

// 声明一个BrowserWindow对象实例
let mainWindow;

//定义一个创建浏览器窗口的方法
function createWindow() {
    // 创建一个浏览器窗口对象，并指定窗口的大小
    console.log(require.resolve('electron'));
    mainWindow = new BrowserWindow({
        center: true,
        icon: 'images/logoSquare.png'
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.maximize();
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
    // // 禁用nodejs和electron的特性
    // var mainWindow = new BrowserWindow({
    // webPreferences: {
    // nodeIntegration: false
    // }
    // });
    // 通过浏览器窗口对象加载index.html文件，同时也是可以加载一个互联网地址的
    // mainWindow.loadURL('./index.html');
    // const dialog = require('electron').dialog;
    // dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
    // 同时也可以简化成：mainWindow.loadURL('./index.html');
    // 监听浏览器窗口对象是否关闭，关闭之后直接将mainWindow指向空引用，也就是回收对象内存空间
}

// 监听应用程序对象是否初始化完成，初始化完成之后即可创建浏览器窗口
app.on("ready", function () {
    enrollerShortcut();
    createWindow();
});

// 监听应用程序对象中的所有浏览器窗口对象是否全部被关闭，如果全部被关闭，则退出整个应用程序。该
app.on("window-all-closed", function () {
    // 判断当前操作系统是否是window系统，因为这个事件只作用在window系统中
    if (process.platform != "darwin") {
        app.quit();
    }
});

// 监听应用程序图标被通过点或者没有任何浏览器窗口显示在桌面上，那我们应该重新创建并打开浏览器窗口，避免Mac OS X系统回收或者销毁浏览器窗口
app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('will-quit', function () {
    //注销全局快捷键
    globalShortcut.unregisterAll();
});

function enrollerShortcut() {
    console.log(globalShortcut.isRegistered('f5'));
    var ret = globalShortcut.register('f5', function () {
        //按下快捷键刷新
        if (mainWindow.isFocused()) {
            // mainWindow.refresh;
            mainWindow.reload();
            console.log("refresh...");
        }
    });
    if (!ret) {
        console.log('快捷键注册出错');
    }
}

