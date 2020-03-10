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
    const navigationContext = page.navigationContext;
    const context = args.context;
    Argument = context.Argument;
    page.bindingContext = navigationContext;
    //Récupération des inofs transmisent
    AF_ext = context.AF_ext;
    extGr = context.extGr;
    extCF = context.extCF;
    AF = context.AF;
    //resetAF_ext(args);
    alert(extCF + "\n" + extGr + "\n" + AF_ext);
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
 * Remet à zéro AF_ext, pour résoudre les problèmes de naviguation
 * @param {*} args 
 */
function resetAF_ext(args) {
    AF_ext.splice(0, AF_ext.length)
    AF_ext = [0];
    for (index = 1; index < AF.length; index++) {
        AF_ext.push(new Array([0]));
    }
    for (let index = 1; index < AF.length; index++) {
        if (AF[index].length > 0) {
            for (let i = 1; i < AF[index].length; i++) {
                AF_ext[index].push((AF[index][i]));
            }
        } else {
            AF_ext[index].splice(0, AF_ext[index].length);
        }
    }
}

exports.resetAF_ext = resetAF_ext;

/**
 * Navigue vers la page précédente (ici "home/home-page")
 * @param {*} args 
 */
function back(args) {
    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;
    AF_ext.splice(1, (AF_ext.length) - 2);
    myFrame.goBack();
}

exports.back = back;

/**
 * Calcule l'extension Grounded (basique)
 * @param {*} args 
 */
function Gr_ext(args) {
    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;

    var isGr = true; //Booleen sur l'existence ou non d'une extension différente de l'ensemble vide

    //Initialisation de extGr (Tableau qui contient l'extension)

    for (let index = 1; index < AF_ext.length; index++) {
        extGr.push(0); //Initialisation à 0 avec -1 comme premier élément (passé dans la naviguation)
    }

    for (let count = 0; count <= AF_ext.length; count++) {
        var Attacked = [0];

        //Initialisation du tableau Attacked qui comptabilise le nombre de fois où chaque argument est attaqué
        for (let index = 1; index < AF_ext.length; index++) {
            Attacked.push(0);
        }

        //Parcours AF_ext et compte le nombre de fois où chaque argument est attaqué
        for (let i = 1; i < AF_ext.length; i++) { //Pour tous les arguments de AF_ext
            for (let j = 1; j < AF_ext[i].length; j++) { //Pour chaque attaque
                for (let k = 1; k < AF_ext.length; k++) {
                    if (AF_ext[i][j] == k) { //Si "k" correspond à un argument attaqué par l'argument "i"
                        Attacked[k] += 1;
                        isGr = false;
                    }
                }
            }
        }
        //Suppression des attaques des arguments attaqués par les arguments acceptés
        for (let i = 1; i < AF_ext.length; i++) {
            if (Attacked[i] == 0) {
                isGr = true;
                extGr[i] = true;
                for (let j = 1; j < AF_ext[i].length; j++) {
                    AF_ext[AF_ext[i][j]].splice(1, AF_ext[AF_ext[i][j]].length - 1);
                    extGr[AF_ext[i][j]] = false;
                }
            }
        }
    }

    //Si l'argument n'a pas été traité
    for (let index = 1; index < extGr.length; index++) {
        if (extGr[index] == 0) {
            extGr[index] = false;
        }
    }

    //Cas où l'argument a été supprimé
    for (let index = 1; index < AF_ext.length; index++) {
        if (AF_ext[index].length < 1 || !AF_ext[index]) {
            extGr[index] = -1;
        }
    }

    /*
    //Affichage
    if (isGr) {
        alert("AF" + "\n" + AF_ext + "\nThere is a Gr ext\n" + Attacked + "\n" + AF_ext.length + "\n" + extGr);
    } else {
        alert("AF" + "\n" + AF_ext + "\nGr ext is {}\n" + Attacked + "\n" + AF_ext.length + "\n" + extGr);
    }
    */

    //Réinitialisation de Attacked
    for (let index = Attacked.length; index > 0; index--) {
        Attacked.splice(index, 1);
    }

    //Naviguation vers "views/Gr_ext/result" avec un context
    const navigationEntry = {
        moduleName: "views/Gr_ext/result",
        context: { AF_ext: AF_ext, extGr: extGr, AF: AF },
        animated: false
    };
    myFrame.navigate(navigationEntry);
}

exports.Gr_ext = Gr_ext;

function disp(args) {
    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;
    alert("Still not Implemented !");
}

exports.disp = disp;

/**
 * @returns true if B is IN A
 * @returns false if B is NOT IN A
 * @param {Array} A (Two dimension Array)
 * @param {Array} B (Simple Array)
 */
function isIn(A, B) {
    var result = false;
    var X = result;
    let isEqualPromise = new Promise((resolve, reject) => {
        for (let index = 0; index < A.length; index++) {
            if (isEqualFlatArrays(A[index], B)) {
                result = true;
            }
        }
        resolve(result);
    })
    isEqualPromise.then((result) => { })
    return (result);
}

exports.isIn = isIn;

/**
 * @returns true if A is EQUAL to B
 * @returns false if A is NOT EQUAL to B
 * @param {Array} A (Simple Array)
 * @param {Array} B (Simple Array)
 */
function isEqualFlatArrays(A, B) {
    if (A.length == B.length) {
        let cpt = 0;
        let cpt1 = 0;
        let cpt2 = 0;
        //A <= B
        for (let index = 0; index < A.length; index++) {
            for (let i = 0; i < B.length; i++) {
                if (A[index] == B[i] && cpt == cpt1) {
                    cpt1++;
                }
            }
            cpt = cpt1;
        }
        cpt = 0;
        //B <= A
        for (let index = 0; index < A.length; index++) {
            for (let i = 0; i < A.length; i++) {
                if (B[index] == A[i] && cpt2 == cpt) {
                    cpt2++;
                }
            }
            cpt = cpt2;
        }
        //if true in both ways
        if (cpt1 == A.length && cpt2 == B.length) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.isEqualFlatArrays = isEqualFlatArrays;

function CF_ext(args) {
    const button = args.object;
    const page = button.page;
    //const myFrame = page.frame;
    //let extCF = new Array();
    //alert(extCF.length);
    if (extCF.length < 1) {
        let A = new Array();
        A[0] = -1;
        for (index = 1; index < AF_ext.length; index++) {
            if (AF_ext[index].length >= 1) {
                A[index] = index;
            }
        }
        let buffer = recCF(A, new Array());
        for (let i = 0; i < buffer.length; i++) {
            for (let index = 0; index < buffer.length; index++) {
                if (index != i && buffer[i] != undefined && buffer[index] != undefined) {
                    if (isEqualFlatArrays(buffer[i], buffer[index])) {
                        buffer.splice(index, 1);
                    }
                }
            }
        }
        let buffer_extCF = new Array([-1]);
        for (let index = 0; index < buffer.length; index++) {
            if (!isIn(buffer_extCF, buffer[index])) {
                buffer_extCF = buffer_extCF.concat((buffer[index]));
            }
        }
        for (let index = 0, i = -1; index < buffer_extCF.length; index++) {
            if (buffer_extCF[index] == -1) {
                extCF.push(new Array([-1]));
                i++;
            } else {
                extCF[i].push(buffer_extCF[index]);
            }
        }
        let suppr = new Array();
        for (let i = 0, OK = false; i < extCF.length; i++) {
            for (let index = 0; index < extCF[i].length; index++) {
                if (extCF[i][index] == undefined) {
                    OK = true;
                }
                if (extCF[i][index] != -1 && extCF[i][index] != undefined) {
                    for (let j = 0; j < AF_ext[extCF[i][index]].length; j++) {
                        for (let k = 0; k < extCF[i].length; k++) {
                            if (AF_ext[extCF[i][index]][j] == extCF[i][k]) {
                                OK = true;
                            }
                        }
                    }
                }
            }
            if (OK) {
                suppr.push(i);
                OK = false;
            }
        }
        for (let index = suppr.length - 1; index >= 0; index--) {
            extCF.splice(suppr[index], 1);
        }
    }
    alert("extCF : " + extCF);

}

exports.CF_ext = CF_ext;

function recCF(A, buffer) {
    var result = new Array();

    if (!isIn(buffer, A)) {
        buffer = buffer.concat(new Array(A));
    }

    for (let index = 1; index < A.length; index++) {
        let B = [-1];
        for (let i = 1; i < A.length; i++) {
            if (index != i) {
                B = B.concat(A[i]);
            }
        }
        let myPromise = new Promise((resolve, reject) => {
            result = recCF(B, new Array());
            if (!isIn(buffer, result)) {
                buffer = buffer.concat(result);
            }
        })
        myPromise.then((result) => { })
    }
    return buffer;
}

exports.recCF = recCF;