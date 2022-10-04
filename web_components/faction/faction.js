class Faction extends HTMLElement{
    constructor(){
        super();
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction/faction.html")
        .then((response) => response.text());
        
        return template;
    }

    //Allows the user to edit text entries by swapping between an input and the static text
    toggleLabel(input, label, defaultLabel){
        if(label.hidden === false){
            label.hidden = true;

            input.value = label.innerHTML;
            input.hidden = false;
            input.focus();
        }
        else{
            input.hidden = true;
            label.hidden = false;

            if(input.value){
                label.innerHTML = input.value;
            }
            else{
                label.innerHTML = defaultLabel;
            }
            this.saveAttributes();
        }
    }

    //Self-delete
    deleteListener(){
        let deleteBtn = this.shadowRoot.getElementById("button-delete-faction");
        let self = this;

        deleteBtn.addEventListener("click", function(){
            self.remove();
        });
    }

    //Allows adding of clocks
    clockListener(){
        let button = this.shadowRoot.getElementById("button-add-clock");
        let clockList = this.shadowRoot.getElementById("clocks");

        button.addEventListener("click", function(){
            let clock = document.createElement("custom-clock");
            clockList.appendChild(clock);
        });
    }

    //Allows adding of traits
    traitListener(){
        let button = this.shadowRoot.getElementById("button-add-trait");
        let traitList = this.shadowRoot.getElementById("traits");

        button.addEventListener("click", function(){
            let trait = document.createElement("custom-trait");
            traitList.appendChild(trait);
        });
    }

    //Allows the renaming of the faction
    factionNameListener(){
        let factionName = this.shadowRoot.getElementById("faction-name");
        let input = this.shadowRoot.getElementById("faction-name-input");

        const toggleLabelBind = this.toggleLabel.bind(this, input, factionName, "Faction Name");

        factionName.addEventListener("click", toggleLabelBind);
        input.addEventListener("blur", toggleLabelBind);

        input.addEventListener("keypress", function(event){
            if(event.key === "Enter"){
                toggleLabelBind();
            }
        });
    }

    //Allows editing dice
    diceListener(){
        let dice = this.shadowRoot.getElementById("dice");
        let input = this.shadowRoot.getElementById("dice-input");

        const toggleLabelBind = this.toggleLabel.bind(this, input, dice, "1");

        dice.addEventListener("click", toggleLabelBind);
        input.addEventListener("blur", toggleLabelBind);

        input.addEventListener("keypress", function(event){
            if(event.key === "Enter"){
                toggleLabelBind();
            }
        });
    }

    //See if we need to save because a child reported it changed and needs to be saved, we brought a new child into this world, or because we mercilessly killed it.
    childSaveDetector(){
        this.addEventListener("save", function(){
            this.saveAttributes();
        });

        //Figure out if a child was added or deleted
        const traitList = this.shadowRoot.getElementById("traits");
        const clockList = this.shadowRoot.getElementById("clocks");

        let config = {childList: true};

        const callback = () =>{
            this.saveAttributes();
        };

        let observer = new MutationObserver(callback);
        observer.observe(traitList, config);
        observer.observe(clockList, config);
    }

    setListeners(){
        this.clockListener();
        this.factionNameListener();
        this.diceListener();
        this.deleteListener();
        this.traitListener();
        this.childSaveDetector();
    }

    //We're saving our attributes so we can reinstate ourselves later when we're saved/loaded.
    saveAttributes(){
        let jsonString = "";

        //Name and dice
        let factionName = this.shadowRoot.getElementById("faction-name");
        this.setAttribute("name", factionName.innerHTML);

        let dice = this.shadowRoot.getElementById("dice");
        this.setAttribute("dice", dice.innerHTML);

        //Traits
        let traits = this.shadowRoot.getElementById("traits");
        let traitList = [];
        for(let i = 0; i < traits.children.length; i++){
            traitList.push(traits.children[i].getAttribute("name") || "Trait Name");
        }
        jsonString = JSON.stringify(traitList);
        this.setAttribute("traits", `{"traits": ${jsonString}}`);

        //Clocks
        let clocks = this.shadowRoot.getElementById("clocks");
        let clockList = [];
        for(let i = 0; i < clocks.children.length; i++){
            let savedClock = clocks.children[i];
            let obj = {
                name: savedClock.getAttribute("name") || "Clock Name",
                size: savedClock.getAttribute("size") || "4",
                progress: savedClock.getAttribute("progress") || "0"
        };
            clockList.push(obj || {name: "Clock Name", size: "4", progress: "0"} );
    }
        jsonString = JSON.stringify(clockList);
        this.setAttribute("clocks", `{"clocks": ${jsonString}}`);
    }

    //We've been loaded and may have values preloaded
    setInitialValues(){
        let factionName = this.shadowRoot.getElementById("faction-name");
        factionName.innerHTML = this.getAttribute("name") || "Faction Name";

        let dice = this.shadowRoot.getElementById("dice");
        dice.innerHTML = this.getAttribute("dice") || "1";
    }

    //Load any traits we should already have.
    setInitialTraits(){
        let traitList = this.shadowRoot.getElementById("traits");
        let traitsAttribute = this.getAttribute("traits") || '{"traits":["Trait Name"]}';
        let json = JSON.parse(traitsAttribute);

        for(let i = 0; i < json.traits.length; i++){
            let trait = document.createElement("custom-trait");
            trait.setAttribute("name", json.traits[i]);
            traitList.appendChild(trait);
        }
    }

    //Load clocks
    setInitialClocks(){
        let clockList = this.shadowRoot.getElementById("clocks");
        let clocksAttribute = this.getAttribute("clocks") || '{"clocks":[{"name": "Clock Name", "size": "4", "progress": "0"}]}';
        let json = JSON.parse(clocksAttribute);

        for(let i = 0; i < json.clocks.length; i++){
            let clock = document.createElement("custom-clock");
            clock.setAttribute("name", json.clocks[i].name);
            clock.setAttribute("size", json.clocks[i].size);
            clock.setAttribute("progress", json.clocks[i].progress);
            clockList.appendChild(clock);
        }
    }

    async init(){
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = await this.fetchTemplate();
        this.setInitialValues();
        this.setInitialTraits();
        this.setInitialClocks();
        this.setListeners();
    }

    connectedCallback(){
        this.init();
    }
}

customElements.define("custom-faction", Faction);