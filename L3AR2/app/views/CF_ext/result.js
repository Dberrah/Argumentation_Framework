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