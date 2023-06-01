/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
class Azonosito extends HTMLElement{
    #tajTomb=[3,7,3,7,3,7,3,7]; //privát minősítés
    #tajOszto=10;
    #adoTomb=[1,2,3,4,5,6,7,8,9];
    #adoOszto=11;
    #omTomb=[1,2,3,4,5,6,7,8,9,10];
    #omOszto=11;
    #bankTomb=[9,7,3,1,9,7,3,1];
    
    //vegyük észre, hogy az egyedi html tag-nél használt megnevezes tag-paraméter 
    //értékeket használtuk fel az elnevezésekben: eval JS függvénnyel jól kihasználható
    //lehet
    constructor(){
        super();
        this.arnyek=this.attachShadow({mode: "open"});
        this.billentyuzet=this.billentyuzet.bind(this); //amennyiben ez elmaradna, akkor a billentyuzet metódusnál, mivel az egy billentyűzet-eseménykezelő, a this a billentyűzethez kapcsolódó eseményt (event) jelölné
        this.felengedes=this.felengedes.bind(this);
        this.mehet=false;
    }
    connectedCallback(){
        var stilus=document.createElement("style");
        this.arnyek.appendChild(stilus);
        this.arnyek.querySelector("style").textContent=`
            input{
                width: 1em;
                text-align: center;
            }
            input:focus{
                border: 2px solid red;
                background: #fbbab7;
                font-size: 1em;
            }
            .oke{
                background: aquamarine;
            }
        `;
        var mennyi=this.getAttribute("hossz");
        var azonosito=this.getAttribute("megnevezes");
        for(var db=1;db<=mennyi;db++){
            var rubrika=document.createElement("input");
            rubrika.id=(azonosito+db);
            rubrika.name=(azonosito+"[]"); //pl. taj[]
            if(db==1&&this.getAttribute("elso")!=""){
                rubrika.value=this.getAttribute("elso");
                rubrika.disabled=true;
            }
            rubrika.size=1;
            rubrika.maxLength=1;
            rubrika.addEventListener("keydown",this.billentyuzet);
            rubrika.addEventListener("keyup",this.felengedes);
            this.arnyek.appendChild(rubrika);
        }
    }
    static get observedAttributes(){
        return ["megnevezes","hossz","elso"];
    }
    billentyuzet(objektum){
        if(objektum.key<"0"||objektum.key>"9"&&objektum!="Backspace"){
            objektum.preventDefault();
            this.mehet=false;
        }else{
            if(objektum.key=="Backspace"){
                if(objektum.target.value==""){
                    const rk1=new RegExp("\\d+");
                    const rk2=new RegExp("\\D+");
                    let szoveg=objektum.target.id.replace(rk1,""); //pl. taj4 esetén taj
                    let szam=objektum.target.id.replace(rk2,""); //pl. taj4 esetén 4
                    if(szam>1) szam--;
                    this.arnyek.getElementById(szoveg+szam).focus();
                    this.mehet=false;
                }else{
                    this.mehet=false;
                }
            }else{
                this.mehet=true;
            }
        }
    }
    felengedes(objektum){
        if(this.mehet){
            const rk1=new RegExp("\\d+");
            const rk2=new RegExp("\\D+");
            let szoveg=objektum.target.id.replace(rk1,"");
            let szam=objektum.target.id.replace(rk2,"");
            szam++;
            var mennyi=this.getAttribute("hossz");
            mennyi++;
            if(szam==mennyi){
                if(this.#ellenorzo(szoveg)){
                    let tomb=this.arnyek.children;
                    for(var i=1;i<tomb.length;i++){ //azért indul 1-ről, mert a 0-ás a style
                        tomb[i].className="oke";
                    }
                    tomb[(tomb.length-1)].blur();
                }
            }else{
                this.arnyek.getElementById(szoveg+szam).focus();
            }
        }
    }
    #ellenorzo(melyik){
        var szorzok=eval("this.#"+melyik+"Tomb"); //pl. this.#tajTomb
        var osszeg=0;
        var tomb=this.arnyek.children;
        var valami=[];
        for(var i=1;i<tomb.length;i++){
            valami.push(tomb[i].value);
        }
        for(var i=0;i<szorzok.length;i++){
            osszeg+=(valami[i]*szorzok[i]);
        }
        var oszto=eval("this.#"+melyik+"Oszto");
        if(valami[szorzok.length]==osszeg%oszto) return true; else return false;
    }
}
