const view = require("tns-core-modules/ui/core/view");
const observableModule = require("tns-core-modules/data/observable");
const Frame = require("tns-core-modules/ui/frame");
const isIOS = require("tns-core-modules/platform").isIOS;

function HomeViewModel() {
    const viewModel = observableModule.fromObject({
    });
    return viewModel;
}

let AF;
let extGr;

function onNavigatingTo(args) {
    const page = args.object;
    const navigationContext = page.navigationContext;
    const context = args.context;
    page.bindingContext = navigationContext;
    AF = context.AF;
    AF_ext = context.AF_ext;
    extGr = context.extGr;
    if (isIOS) {
        let container = page.getViewById("actionBar");
        let return_btn = container.getViewById("return");
        if (return_btn) {
            container.removeChild(return_btn);
            container.columns = "*";
        }
    }
}

exports.onNavigatingTo = onNavigatingTo;

/**
 * Navigue vers la page précédente (ici "views/semantics")
 * @param {*} args 
 */
function back(args) {
    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;
    myFrame.goBack();
}

exports.back = back;

const startScale = 1;
let newScale = 1;
/**
 * Modifie la taille des éléments dans la fenêtre
 * @param {*} args 
 */
function zoom(args) {
    const grid = args.object;
    const page = grid.page;
    if (args.scale && args.scale !== 1) {
        newScale = startScale * args.scale;
        for (let x = 1; x <= Argument; x++) { //Modifie la taille de tous les boutons
            page.getViewById(x).scaleX = newScale;
            page.getViewById(x).scaleY = newScale;
        }
    }
}

exports.zoom = zoom;

const Button = require("tns-core-modules/ui/button").Button;

/**
 * 
 * @param {*} args 
 */
function pageLoaded(args) {
    const button = args.object;
    const page = button.page;
    const container = page.getViewById("AF");
    let rowIndex = 0;
    let rowsNumber = "auto";
    for (let index = 1; index < extGr.length; index++) {
        rowsNumber += ",auto";
    }
    container.rows = rowsNumber;
    for (let index = 1; index < extGr.length; index++, rowIndex++) { //Affiche extGr

        if (extGr[index] == true) { //Si l'argument est accepté
            let mybutton = new Button();
            mybutton.text = index;
            mybutton.id = index;
            mybutton.class = "btn my-button-true"; //Sa couleur sera bleu
            container.addChild(mybutton);
            mybutton.row = rowIndex;
        } else if (extGr[index] == false) { //Si l'argument est rejeté
            let mybutton = new Button();
            mybutton.text = index;
            mybutton.id = index;
            mybutton.class = "btn my-button-false"; // Sa couleur sera rouge
            container.addChild(mybutton);
            mybutton.row = rowIndex;
        }
    }
    //Réinitialise extGr
    for (let index = extGr.length - 1; index > 0; index--) {
        //if (extGr[index] != (-1)) {
        extGr.pop();
        //}
    }
}

exports.pageLoaded = pageLoaded;