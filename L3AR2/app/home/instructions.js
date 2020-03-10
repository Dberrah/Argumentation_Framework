const view = require("tns-core-modules/ui/core/view");
const observableModule = require("tns-core-modules/data/observable");
const Frame = require("tns-core-modules/ui/frame");
const isIOS = require("tns-core-modules/platform").isIOS;

function HomeViewModel() {
    const viewModel = observableModule.fromObject({
    });
    return viewModel;
}

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}

exports.onNavigatingTo = onNavigatingTo;

function onCloseModal(args) {
    args.object.closeModal();
}

exports.onCloseModal = onCloseModal;