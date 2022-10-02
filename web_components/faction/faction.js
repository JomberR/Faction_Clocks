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

    //Listen to our children via event bubbling
    childListeners(){
        const saveAttributesBind = this.saveAttributes.bind(this);
        this.addEventListener("save", function(){
            saveAttributesBind();
        });
    }

    setListeners(){
        this.clockListener();
        this.factionNameListener();
        this.diceListener();
        this.deleteListener();
        this.traitListener();
        this.childListeners();
    }

    //We're saving our attributes so we can reinstate ourselves later when we're saved/loaded.
    saveAttributes(){
        //Name and dice
        let factionName = this.shadowRoot.getElementById("faction-name");
        this.setAttribute("name", factionName.innerHTML);

        let dice = this.shadowRoot.getElementById("dice");
        this.setAttribute("dice", dice.innerHTML);

        //Traits
        let traits = this.shadowRoot.getElementById("traits");
        let traitList = [];
        for(let i = 0; i < traits.children.length; i++){
            traitList.push(traits.children[i].getAttribute("name"));
        }
        let jsonString = JSON.stringify(traitList);
        this.setAttribute("traits", `{"traits": ${jsonString}}`);
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
        let traits = this.getAttribute("traits") || '{"traits":["Trait Name"]}';
        let json = JSON.parse(traits);

        for(let i = 0; i < json.traits.length; i++){
            let trait = document.createElement("custom-trait");
            trait.setAttribute("name", json.traits[i]);
            traitList.appendChild(trait);
        }
    }

    async init(){
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = await this.fetchTemplate();
        this.setInitialValues();
        this.setInitialTraits();
        this.setListeners();
    }

    connectedCallback(){
        this.init();
    }
}

customElements.define("custom-faction", Faction);