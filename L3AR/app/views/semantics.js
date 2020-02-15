const view = require("tns-core-modules/ui/core/view");
const observableModule = require("tns-core-modules/data/observable");
const Frame = require("tns-core-modules/ui/frame");

function HomeViewModel() {
    const viewModel = observableModule.fromObject({
    });
    return viewModel;
}

let AF;
let Argument;

function onNavigatingTo(args) {

    const page = args.object;
    const navigationContext = page.navigationContext;

    // The navigation event arguments are of type NavigatedData and provide another way to grab the passed context
    const context = args.context;
    AF = context.AF;
    Argument = context.Argument;
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

function Gr_ext(args){
    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;
    var Attacked = [0];
    var isGr = true;
    let extGr = [-1];
    let AF_ext = [0];
    for (let index = 1; index < AF.length; index++) {
        AF_ext.push(AF[index]);
    }

    for (let index = 1; index < AF_ext.length; index++) {
        extGr.push(0);
        //if(AF[index].length<1){
        //    AF_ext.splice(index, 1);
        //}
    }
    for(let count=0; count<AF_ext.length; count++){    
        var Attacked = [0];
        for (let index = 1; index < AF_ext.length; index++) {
            Attacked.push(0);
        }
        for(let i=1; i<AF_ext.length; i++) {
            for(let j=1; j<AF_ext[i].length; j++) {
                for(let k=1; k<AF_ext.length; k++) {
                    if(AF_ext[i][j] == k) {
                        Attacked[k] +=1;
                        isGr=false;
                        
                    }
                }
            }
        }
        for (let i = 1; i < AF_ext.length; i++) {
            if(Attacked[i] == 0) {
                isGr = true;
                extGr[i]=true;
                for(let j=1; j<AF_ext[i].length; j++){
                    AF_ext[AF_ext[i][j]].splice(1, AF_ext[AF_ext[i][j]].length-1);
                    extGr[AF_ext[i][j]]=false;
                }
            }
        }
    }
    for (let index = 1; index < extGr.length; index++) {
        if(extGr[index] == 0){
            extGr[index] = false;
        }
    }
    for (let index = 1; index < AF_ext.length; index++) {
        if(AF[index].length<1 || !AF[index]){
            extGr[index] = -1;
        }
    }
    if(isGr){
        alert(AF+"\n"+AF_ext+"\nThere is a Gr ext\n"+Attacked+"\n"+AF_ext.length+"\n"+extGr);
    }else{
        alert(AF+"\n"+AF_ext+"\nGr ext is {}\n"+Attacked+"\n"+AF_ext.length+"\n"+extGr);
    }
    const navigationEntry = {
        moduleName: "views/Gr_ext/result",
        context : { AF : AF, extGr : extGr },
        animated: false
    };
    myFrame.navigate(navigationEntry);
}

exports.Gr_ext = Gr_ext;

function CF_ext(args){
    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;
    //alert("Conflict-Free extension");
    let AF_ext = [0];
    for (let index = 1; index < AF.length; index++) {
        AF_ext.push(AF[index]);
    }
    //let buffer = [-1];
    let A = [-1];
    for(index = 1; index < AF_ext.length; index++){
        A.push(index);
    }
    //alert("A = "+A);
    //alert("limit : "+(AF_ext.length));
    let extCF = [-1];
//    extCF.push(enumPart(buffer = new Array(),A));
    //let tmp =[];
    for (let index = 1; index < AF_ext.length; index++) {
        //alert(extCF+"\n index : "+index);
        extCF.push(recCF(index,(AF_ext.length),new Array([-1],[index])));
    }
    //extCF.push(recCF(1,AF_ext.length-1,new Array([-1])));
    //for (let i = 0; i < extCF.length; i++) {
        //alert("extCF["+i+"] : "+extCF[i]);
    //}
    alert(extCF);
}

exports.CF_ext = CF_ext;

function disp(args){
    const button = args.object;
    const page = button.page;
    const myFrame = page.frame;
    alert("Still not Implemented");
}

exports.disp = disp;

function recCF(i,limit,buffer){
    /*if(i<limit){
        buffer[0].push(i);
        //buffer.push(buffer[0]);
        if(i<limit){
            let buffer1 = new Array(recCF(i+1,limit,new Array(buffer[0])));
            buffer.push(buffer1);
        }
        //buffer.push(new Array(buffer[0]).push(i));
        return buffer;
    }
    return 0;*/
    let k = buffer.length;
    //alert(i+"\n"+buffer[k-1]);
    if(i<limit-1) {buffer.push(new Array([-1],[i])); k++}
    for (let index = i+1; index < limit; index++) {
        if(buffer[k-1][buffer[k-1].length-1]!=index) buffer[k-1].push(index);
        recCF(index,limit,buffer,k);
        k++;
    }
    
    return (buffer);
}

exports.recCF = recCF;

function enumPart(buffer,A){
    
    buffer.push(enumPartR(buffer,new Array([-1]),new Array(),A));
    //alert(buffer+"\n"+A);
    //alert("buffer : "+buffer);
    return(buffer);
}

exports.enumPart = enumPart;

//alert("buffer : "+buffer+"\nI : "+I+"\nO : "+O+"\nU : "+U);
//alert("UUUUUU\n"+buffer+"\n"+U+"\nI : "+I);
//alert("buffer : "+buffer+"\nI : "+I+"\nO : "+O+"\nU : "+U);
//alert("buffer : "+buffer);
//alert("buffer : "+buffer+"\nI : "+I+"\nO : "+O+"\nU : "+U);

function enumPartR(buffer,I,O,U){
    //alert("yooooo : "+I);
    if(U.length == 1){
        //alert("I1 : "+I);
        //buffer.push(I);
        //alert("1 : "+buffer)
        //alert("I : "+I);
        let buffer1 = I.flat();
        //alert("bufferI : "+buffer1);
        return (buffer1);
    }else{
        var x = U.pop();
        //U.splice(1,1);
        //alert("U2 : "+U);
        let A = new Array();
        let B = new Array();
        for (let index = 0; index < I.length; index++) {
            A.push(I[index]);
        }
        for (let index = 0; index < O.length; index++) {
            B.push(O[index]);
        }
        A.push(x);
        B.push(x);
        let C = enumPartR(buffer, I, B, U);
        let D = enumPartR(buffer, A, O, U);
        alert(/*"buffer : "+buffer+"\nI : "+I+"\nO : "+O+"\nU : "+U+"\n*/"C : "+C+"\nD : "+D);
        buffer.push(C);
        buffer.push(D);
        //alert(buffer);
        return(buffer);
    }
}

exports.enumPartR = enumPartR;