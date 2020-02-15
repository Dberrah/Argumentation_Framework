const view = require("tns-core-modules/ui/core/view");
const observableModule = require("tns-core-modules/data/observable");
const Frame = require("tns-core-modules/ui/frame");

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

    // The navigation event arguments are of type NavigatedData and provide another way to grab the passed context
    const context = args.context;
    AF = context.AF;
    extGr = context.extGr;
    page.bindingContext = navigationContext;
    
}

exports.onNavigatingTo = onNavigatingTo;

function back(args){
    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;
    myFrame.goBack();
}

exports.back = back;

const startScale = 1;
let newScale = 1;
function zoom(args){
    const grid = args.object;
    const page = grid.page;
    if (args.scale && args.scale !== 1) {
        newScale = startScale * args.scale;
        for (let x = 1; x <= Argument; x++) {
            page.getViewById(x).scaleX = newScale;
            page.getViewById(x).scaleY = newScale;
        }
    }
}

exports.zoom = zoom;

const Button = require("tns-core-modules/ui/button").Button;

function pageLoaded(args){
    const button = args.object;
    const page = button.page;
    const container = page.getViewById("AF");
    for (let index = 0; index < extGr.length; index++) {
        if(extGr[index] == true){
            let mybutton = new Button();
            mybutton.text = index;
            mybutton.id = index;
            mybutton.class = "btn my-button-true";
            container.addChild(mybutton);
        }else if(extGr[index] == false){
            let mybutton = new Button();
            mybutton.text = index;
            mybutton.id = index;
            mybutton.class = "btn my-button-false";
            container.addChild(mybutton);
        }
    }
}

exports.pageLoaded = pageLoaded;