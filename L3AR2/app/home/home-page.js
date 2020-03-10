const HomeViewModel = require("./home-view-model");
const Button = require("tns-core-modules/ui/button").Button;
const view = require("tns-core-modules/ui/core/view");
const timerModule = require("tns-core-modules/timer");
const SVGImage = require("@teammaestro/nativescript-svg").SVGImage;
const Frame = require("tns-core-modules/ui/frame");
const AbsoluteLayout = require("tns-core-modules/ui/layouts/absolute-layout");
const GridLayout = require("tns-core-modules/ui/layouts/grid-layout");
const Observable = require("tns-core-modules/data/observable").Observable;
const EventData = require("tns-core-modules/data/observable");
const GestureTypes = require("tns-core-modules/ui/gestures");
const panGestureEventData = require("tns-core-modules/ui/gestures");
//const canvas = require("nativescript-canvas");

let extGr = [-1];
let AF = [0];
let AF_ext = [0];
let extCF = new Array();
let dragged = false;
let argument = 0;
let isDoubleTapped = false;
let previousTap;
let prevDeltaX;
let prevDeltaY;
const startScale = 1;
let newScale = 1;

/**
 * Met en place le contexte de la view
 * 
 * Si AF_ext a été modifié, il est supprimé et réinitialisé pour être égal à AF.
 * De plus, extGr est réinitialisé.
 * @param {*} args 
 */
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();

    //réinitialise extGr
    let tmp = 0;
    do {
        tmp = extGr.pop();
    } while (tmp != -1);
    extGr.push(new Array([-1]));
    extCF.splice(0, extCF.length);

}

exports.onNavigatingTo = onNavigatingTo;

let alreadyLoadedOnce = false;

function onPageLoaded(args) {
    const view = args.object;
    const context = null;
    const closeCallback = null;
    const fullscreen = false;
    if (!alreadyLoadedOnce) {
        view.showModal("home/instructions", context, closeCallback, fullscreen);
        alreadyLoadedOnce = true;
    }
}

exports.onPageLoaded = onPageLoaded;


/**
 * Permet d'ajouter un Argument et de mettre en place la gestion d'évènements
 * @param {*} args 
 */
function addArg(args) {
    const button = args.object;
    const page = button.page;
    const container = page.getViewById("AF");
    let isSuppr = 0;

    //Vérifie si un argument a été supprimé
    for (let index = argument; index > 0; index--) {
        if (container.getViewById(index) == undefined) {
            isSuppr = index; //Si oui, isSuppr prend la valeur du plus petit argument supprimé
        }
        //alert(container.getViewById(index) == undefined);
    }
    //alert(isSuppr);
    if (isSuppr == 0) { //Si il n'y a pas d'argument supprimé
        argument++;
    }
    //Création d'un nouveau bouton
    let mybutton = new Button();
    mybutton.class = "btn my-button"; //Attribution du style (voir .css)
    if (isSuppr == 0) { //Si il n'y a pas d'argument supprimé
        mybutton.text = argument;
        mybutton.id = argument;
        AF.push(new Array([0])); //Mise à jour de AF 
        //AF_ext.push(new Array([0])); //Mise à jour de AF_ext
        if (AF[argument]) { //Vérifie que l'argument a bien été créer et affiche les systèmes d'argumentation du graph
            alert(AF + "\n" + AF_ext);
        }
    } else { //Si il y a un argument supprimé
        mybutton.text = isSuppr;
        mybutton.id = isSuppr;
        AF[isSuppr].push(new Array([0]));//Mise à jour de AF 
        //AF_ext[isSuppr].push(new Array([0]));//Mise à jour de AF_ext
        if (AF[isSuppr]) {//Vérifie que l'argument a bien été créer et affiche les systèmes d'argumentation du graph
            alert(AF + "\n" + AF_ext);
        }
    }
    mybutton.on("doubleTap", (data) => { //Gestion de l'event DoubleTap
        eventDoubleTap(data);
    });
    mybutton.on("longPress", (data) => { //Gestion de l'event longPress
        eventLongPress(data);
    });
    mybutton.on("pan", (data) => { //Gestion de l'event pan
        clickDrag(data);
    });
    container.addChild(mybutton);
}

exports.addArg = addArg;

/**
 * Gestion de l'event doubleTap
 * 
 * Ajoute une attaque si elle n'est pas déjà existante et supprime l'attaque si elle est existante
 * @param {*} args 
 */
function eventDoubleTap(args) {
    const mybutton = args.object;

    //alert("Double Tapped !");
    const page = mybutton.page;
    const container = page.getViewById("AF");
    let i = 0;
    let j = 1;
    let index = 0;
    let isAttacked = false; //Booleen qui indique si l'attaque existe déjà
    if (isDoubleTapped) { //Booleen qui permet de savoir si c'est l'argument qui attaque ou si c'est l'attaqué
        //alert(previousTap.id+" vers "+mybutton.id);

        let myPromise = new Promise((resolve, reject) => {
            for (j = 1; j < AF[previousTap.id].length; j++) { //Vérifie si l'attaque existe déjà
                if (AF[previousTap.id][j] == mybutton.id) {
                    isAttacked = true;
                }
            }
            for (index = argument; index > 0; index--) {
                //alert((index == previousTap.id) + "\n"+previousTap.id+"\n"+index);
                if (index == previousTap.id && !isAttacked) { //Si l'attaque n'existe pas encore
                    AF[index].push(mybutton.id); //Ajout de l'attaque dans AF
                    //AF_ext[index].push(mybutton.id); //Ajout de l'attaque dans AF_ext
                    //alert("Pushed ! " + AF[index])
                    var result = index + " attaque les noeuds "; //Création du message lors de la création d'une attaque
                    for (let i = 1; i < AF[index].length; i++) {
                        if (i == 1) {
                            result += AF[index][i];
                        } else if (i == AF[index].length - 1) {
                            result += " et " + AF[index][i];
                        } else {
                            result += ", " + AF[index][i];
                        }
                    }
                } else if (isAttacked) { //Si l'attaque existe déjà
                    result = 0;
                }
            }
            resolve(result); //Renvoi la variable result 
        })
        myPromise.then((result) => {
            if (result == 0) { //Si l'attaque existe déjà
                let thisPromise = new Promise((resolve, reject) => { //Permet d'attendre le return du confirm
                    var result1 = confirm("Voulez-vous supprimer l'attaque de " + previousTap.id + " vers " + mybutton.id);
                    resolve(result1);
                })
                thisPromise.then((result1) => {
                    if (result1) { //Si l'utilisateur veut supprimer l'attaque
                        AF[previousTap.id].splice(j - 1, 1); //Suppression de l'attaque dans AF
                        //AF_ext[previousTap.id].splice(j - 1, 1); //Suppression de l'attaque dans AF_ext
                        //alert("OK");
                    } else { //Si l'utilisateur ne veut pas supprimer l'attaque
                        alert("Cette attaque ne sera pas supprimée !");
                    }
                });
            } else if (result != null) { //Si l'attaque n'existe pas encore
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
}

exports.eventDoubleTap = eventDoubleTap;

/**
 * Gestion de l'event longPress
 * 
 * Supprime un argument et toutes les attaques qui le concernent
 * @param {*} args 
 */
function eventLongPress(args) {
    const mybutton = args.object;

    let myPromise = new Promise((resolve, reject) => { //Permet d'attendre le return du confirm
        var result = confirm("Voulez-vous supprimer ce noeud ?");
        resolve(result);
    })
    myPromise.then((result) => {
        if (result) { //Si l'utilisateur veut supprimer le noeud (l'argument)
            mybutton.parent.removeChild(mybutton); // Suppression de l'argument
            AF[mybutton.id].splice(0, AF[mybutton.id].length); //Suppression de l'argument dans AF
            //AF_ext[mybutton.id].splice(0, AF_ext[mybutton.id].length); //Suppression de l'argument dans AF_ext
            for (let index = 0; index < AF.length; index++) { //Suppression des attaques qui concernent l'argument supprimé
                if (index == mybutton.id) {
                    continue;
                }
                for (let k = 0; k < AF[index].length; k++) {
                    if (AF[index][k] == mybutton.id) {
                        AF[index].splice(k, 1);
                        //AF_ext[index].splice(k, 1);
                    }
                }
            }
        } else { //Si l'utilisateur ne veut pas supprimer le noeud (l'argument)
            alert("Ce noeud ne sera pas supprimé !");
        }
    });
}

exports.eventLongPress = eventLongPress;

/**
 * Permet de Clear le graph, AF, et AF_ext et réinitialise la variable argument
 * @param {*} args 
 */
function suppArg(args) {
    const button = args.object;
    const page = button.page;
    while (argument > 0) { //Pour tous les arguments
        const container = page.getViewById("AF");
        var delbutton = container.getViewById(argument);
        if (delbutton) { //Si le noeud existe
            container.removeChild(delbutton);
        }
        AF.splice(argument, 1); //Suppression de l'argument dans AF
        //AF_ext.splice(argument, 1); //Suppression de l'argument dans AF_ext
        argument--;
    }
}

exports.suppArg = suppArg;

/**
 * Gestion de l'event pan
 * Permet de faire bouger les arguments
 * @param {*} args 
 */
function clickDrag(args) {
    const button = args.object;
    const page = button.page;
    const container = page.getViewById("AF");

    if (args.state === 1) { //Quand on clique sur le noeud
        prevDeltaX = 0;
        prevDeltaY = 0;
    } else if (args.state === 2) { //Quand on bouge le noeud
        button.translateX += (args.deltaX - prevDeltaX);
        button.translateY += (args.deltaY - prevDeltaY);

        prevDeltaX = args.deltaX;
        prevDeltaY = args.deltaY;

        let convFactor = button.width / button.getMeasuredWidth();
        //Met en place les bords droit et bas
        let edgeX = ((container.getMeasuredWidth() - button.getMeasuredWidth()) * convFactor);
        let edgeY = ((container.getMeasuredHeight() - button.getMeasuredHeight()) * convFactor);

        //Permet de ne pas faire sortir les arguments de l'écran
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

/**
 * Modifie la taille des éléments dans la fenêtre
 * @param {*} args 
 */
function zoom(args) {
    const grid = args.object;
    const page = grid.page;
    if (args.scale && args.scale !== 1) {
        newScale = startScale * args.scale;
        for (let x = 1; x <= argument; x++) { //Modifie la taille de tous les boutons
            page.getViewById(x).scaleX = newScale;
            page.getViewById(x).scaleY = newScale;
        }
    }
}

exports.zoom = zoom;

/**
 * Navigue vers "views/semantics" et passe le contexte
 * @param {*} args 
 */
function validateGraph(args) {
    /*
    const view = args.object;
    const context = null;
    const closeCallback = null;
    const fullscreen = true;
    view.showModal("views/semantics-root", context, closeCallback, fullscreen)
    */

    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;
    resetAF_ext(args);
    const navigationEntry = {
        moduleName: "views/semantics",
        context: { AF_ext: AF_ext, extGr: extGr, extCF: extCF, AF: AF }, //Infos transmisent
        animated: false
    };
    myFrame.navigate(navigationEntry);

}

exports.validateGraph = validateGraph;

function resetAF_ext(args) {
    AF_ext.splice(0, AF_ext.length)
    AF_ext = [0];
    for (index = 1; index < AF.length; index++) {
        AF_ext.push(new Array([0]));
    }
    //alert("AF_ext : " + AF_ext);
    for (let index = 1; index < AF.length; index++) {
        if (AF[index].length > 0) {
            //AF_ext.push(new Array([0]));
            for (let i = 1; i < AF[index].length; i++) {
                AF_ext[index].push((AF[index][i]));
            }
        } else {
            AF_ext[index].splice(0, AF_ext[index].length);
        }
        //alert(AF + "\n" + AF_ext);
    }
    //alert("AF_ext = " + AF_ext);
}

exports.resetAF_ext = resetAF_ext;