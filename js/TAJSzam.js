class TAJSzam extends HTMLElement{      /*egy taj szám nevű osztályt határoz meg*/
    constructor(){
     super();
     //console.log("Példányosítás");
     this.shadowDOM = this.attachShadow({mode: "open"});
     this.billentyuzet=this.billentyuzet.bind(this);
     this.felengedes=this.felengedes.bind(this);
     this.mehet = false;
        
    }
    connectedCallback(){
        //console.log("Felülethez torténő hozzáadás");
        var stilus = document.createElement("style");
        this.shadowDOM.appendChild(stilus);
        this.shadowDOM.querySelector("style").textContent=`
        input{
            width: 1em;
            text-align: center;
        }
        input:focus{
            border: 2px solid red;
            background-color: #fbbab7;
            font-size: 1em;
        }
        `;
        var mennyi = this.getAttribute("hossz");
        for(var db = 1; db<=mennyi; db++){
            var rubrika=document.createElement("input");
            rubrika.size=1;
            rubrika.maxLength=1;
            var az = this.getAttribute("megnevezes");
            az = az+db;
            rubrika.id=az;
            rubrika.addEventListener("keydown",this.billentyuzet)
            rubrika.addEventListener("keyup",this.felengedes)
            this.shadowDOM.appendChild(rubrika);
        }

    }
    disconnectCallback(){
        console.log("Felülethez torténő elvétel");
    }
    attributeChangedCallback(){
        console.log("A teg paraméter értékének változtatása");
    }
    adoptedCallback(){
        console.log("más felületre torténő áthelyezés.");
    }
    static get observedAttributes(){
        return ["megnevezes","hossz","elso"];                       /*valóságban itt az attributomok azonosítói jelenek meg */ 
    }
    billentyuzet(objektum){
        if (objektum.key<"0" || objektum.key>"9"&&objektum.key!="Backspace") {
            objektum.preventDefault();
            this.mehet = false;
        }else{
            this.mehet = true;
        }
    }
    felengedes(objektum){
        window.alert(objektum.target.id);
        if(this.mehet){
            switch(objektum.target.id){
                case "taj1":
                    for(var elem in this.shadowDOM) window.alert(elem+": "+this.shadowDOM[elem]);
                    document.shadowDOM.getElementById("taj2").focus();
                    break;
                case "taj2":
                    document.getElementById("taj3").focus();
                    break;

                    
            }
            var rk1 = new RegExp("\\d+");
            var rk2 = new RegExp("\\D+");
            var szoveg = objektum.target.id.replace(rk1,"");
            var szam = objektum.target.id.replace(rk2,"");
            szam++;
            if(szam==(this.getAttribute("hossz")+1)){
                this.shadowDOM.getElementById(szoveg+"9").blur();
            }else{
                this.shadowDOM.getElementById(szoveg+(szam<9?szam:9)).focus();
            }
            
        }
    }

}