const HomeViewModel = require("./home-view-model");
const view = require("tns-core-modules/ui/core/view");
const timerModule = require("tns-core-modules/timer");
const SVGImage = require("@teammaestro/nativescript-svg").SVGImage;
const Button = require("tns-core-modules/ui/button").Button;
const Frame = require("tns-core-modules/ui/frame");
//const canvas = require("nativescript-canvas");

let extGr = [-1];
let AF = [0];
let AF_ext = [0];

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
    if (AF_ext != AF) {
        AF_ext = new Array([0]);
        for (let index = 1; index < AF.length; index++) {
            AF_ext.push(new Array(AF[index]));
        }
        alert(AF + "\n" + AF_ext);
    }
    let tmp = 0;
    do {
        tmp = extGr.pop();
    } while (tmp != -1);
    extGr.push(new Array([-1]));
}

exports.onNavigatingTo = onNavigatingTo;

let dragged = false;
let argument = 0;
let isDoubleTapped = false;
let previousTap;


function addArg(args) {
    const button = args.object;
    const page = button.page;
    const container = page.getViewById("AF");
    let isSuppr = 0;

    for (let index = argument; index > 0; index--) {
        if (container.getViewById(index) == undefined) {
            isSuppr = index;
        }
        //alert(container.getViewById(index) == undefined);
    }
    //alert(isSuppr);
    if (isSuppr == 0) {
        argument++;
    }
    let mybutton = new Button();
    mybutton.class = "btn my-button";
    if (isSuppr == 0) {
        mybutton.text = argument;
        mybutton.id = argument;
        AF.push(new Array([0]));
        AF_ext.push(new Array([0]));
        if (AF[argument]) {
            alert(AF + "\n" + AF_ext);
        }
    } else {
        mybutton.text = isSuppr;
        mybutton.id = isSuppr;
        AF[isSuppr].push(new Array([0]));
        AF_ext[isSuppr].push(new Array([0]));
        if (AF[isSuppr]) {
            alert(AF + "\n" + AF_ext);
        }
    }
    mybutton.on("doubleTap", (data) => {
        //alert("Double Tapped !");
        const page = mybutton.page;
        const container = page.getViewById("AF");
        let i = 0;
        let j = 1;
        let index = 0;
        let isAttacked = false;
        if (isDoubleTapped) {
            //alert(previousTap.id+" vers "+mybutton.id);

            let myPromise = new Promise((resolve, reject) => {
                for (j = 1; j < AF[previousTap.id].length; j++) {
                    if (AF[previousTap.id][j] == mybutton.id) {
                        isAttacked = true;
                    }
                }
                for (index = argument; index > 0; index--) {
                    //alert((index == previousTap.id) + "\n"+previousTap.id+"\n"+index);
                    if (index == previousTap.id && !isAttacked) {
                        AF[index].push(mybutton.id);
                        AF_ext[index].push(mybutton.id);
                        //alert("Pushed ! " + AF[index])
                        var result = index + " attaque les noeuds ";
                        for (let i = 1; i < AF[index].length; i++) {
                            if (i == 1) {
                                result += AF[index][i];
                            } else if (i == AF[index].length - 1) {
                                result += " et " + AF[index][i];
                            } else {
                                result += ", " + AF[index][i];
                            }
                        }
                    } else if (isAttacked) {
                        result = 0;
                    }
                }
                resolve(result);
            })
            myPromise.then((result) => {
                if (result == 0) {
                    let thisPromise = new Promise((resolve, reject) => {
                        var result1 = confirm("Voulez-vous supprimer l'attaque de " + previousTap.id + " vers " + mybutton.id);
                        resolve(result1);
                    })
                    thisPromise.then((result1) => {
                        if (result1) {
                            AF[previousTap.id].splice(j - 1, 1);
                            AF_ext[previousTap.id].splice(j - 1, 1);
                            //alert("OK");
                        } else {
                            alert("Cette attaque ne sera pas supprimée !");
                        }
                    });
                } else if (result != null) {
                    alert(result);
                } else {
                    alert("undefined haha");
                }
            })
            isDoubleTapped = false;
            /*    if (AF[previousTap.id][0] == 0) {
                    AF[previousTap.id][0] = mybutton.id;
                }else{
                    let i = AF[previousTap.id].length;
                    AF[previousTap.id][i] = mybutton.id;
                }*/
        } else {
            isDoubleTapped = true;
            previousTap = mybutton;
        }
    });
    mybutton.on("longPress", (data) => {
        let myPromise = new Promise((resolve, reject) => {
            var result = confirm("Voulez-vous supprimer ce noeud ?");
            resolve(result);
        })
        myPromise.then((result) => {
            if (result) {
                mybutton.parent.removeChild(mybutton);
                AF[mybutton.id].splice(0, AF[mybutton.id].length);
                AF_ext[mybutton.id].splice(0, AF_ext[mybutton.id].length);
                for (let index = 0; index < AF.length; index++) {
                    if (index == mybutton.id) {
                        continue;
                    }
                    for (let k = 0; k < AF[index].length; k++) {
                        if (AF[index][k] == mybutton.id) {
                            AF[index].splice(k, 1);
                            AF_ext[index].splice(k, 1);
                        }
                    }
                }
            } else {
                alert("Ce noeud ne sera pas supprimé !");
            }
        });
    });
    mybutton.on("pan", (data) => {
        clickDrag(data);
    });
    container.addChild(mybutton);
}

exports.addArg = addArg;

function suppArg(args) {
    const button = args.object;
    const page = button.page;
    let OK = false;
    while (!OK && argument > 0) {
        const container = page.getViewById("AF");
        var delbutton = container.getViewById(argument);
        if (delbutton) {
            container.removeChild(delbutton);
            //OK = true;
        }
        AF.splice(argument, 1);
        AF_ext.splice(argument, 1);
        argument--;
    }
}

exports.suppArg = suppArg;

const AbsoluteLayout = require("tns-core-modules/ui/layouts/absolute-layout");
const GridLayout = require("tns-core-modules/ui/layouts/grid-layout");
const Observable = require("tns-core-modules/data/observable").Observable;
const EventData = require("tns-core-modules/data/observable");
const GestureTypes = require("tns-core-modules/ui/gestures");
const panGestureEventData = require("tns-core-modules/ui/gestures");

let prevDeltaX;
let prevDeltaY;

function clickDrag(args) {
    const button = args.object;
    const page = button.page;
    const container = page.getViewById("AF");

    if (args.state === 1) {
        prevDeltaX = 0;
        prevDeltaY = 0;
    } else if (args.state === 2) {
        button.translateX += (args.deltaX - prevDeltaX);
        button.translateY += (args.deltaY - prevDeltaY);

        prevDeltaX = args.deltaX;
        prevDeltaY = args.deltaY;

        let convFactor = button.width / button.getMeasuredWidth();
        let edgeX = ((container.getMeasuredWidth() - button.getMeasuredWidth()) * convFactor);
        let edgeY = ((container.getMeasuredHeight() - button.getMeasuredHeight()) * convFactor);

        if (button.translateX < 0) {
            button.translateX = 0;
        }
        else if (button.translateX > edgeX) {
            button.translateX = edgeX;
        }

        if (button.translateY < 0) {
            button.translateY = 0;
        }
        else if (button.translateY > edgeY) {
            button.translateY = edgeY;
        }
    }
}

exports.clickDrag = clickDrag;

const startScale = 1;
let newScale = 1;
function zoom(args) {
    const grid = args.object;
    const page = grid.page;
    if (args.scale && args.scale !== 1) {
        newScale = startScale * args.scale;
        for (let x = 1; x <= argument; x++) {
            page.getViewById(x).scaleX = newScale;
            page.getViewById(x).scaleY = newScale;
        }
    }
}

exports.zoom = zoom;


function validateGraph(args) {
    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;
    //myFrame.navigate("secondary-page");
    //Frame.topmost().navigate("home2/semantics");
    const navigationEntry = {
        moduleName: "views/semantics",
        context: { AF_ext: AF_ext, extGr: extGr },
        animated: false
    };
    myFrame.navigate(navigationEntry);
}

exports.validateGraph = validateGraph;