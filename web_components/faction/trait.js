class Trait extends HTMLElement{
    constructor(){
        super();
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction/trait.html")
        .then((response) => response.text());
        
        return template;
    }

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
        }
    }

    traitNameListener(){
        let traitName = this.shadowRoot.getElementById("trait-name");
        let input = this.shadowRoot.getElementById("trait-name-input");

        const toggleLabelBind = this.toggleLabel.bind(this, input, traitName, "Trait Name");

        traitName.addEventListener("click", toggleLabelBind);
        input.addEventListener("blur", toggleLabelBind);

        input.addEventListener("keypress", function(event){
            if(event.key === "Enter"){
                toggleLabelBind();
            }
        });
    }

    deleteListener(){
        let deleteBtn = this.shadowRoot.getElementById("button-delete-trait");
        let self = this;

        deleteBtn.addEventListener("click", function(){
            self.remove();
        });
    }

    setListeners(){
        this.traitNameListener();
        this.deleteListener();
    }

    async init(){
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = await this.fetchTemplate();
        this.setListeners();
    }

    connectedCallback(){
        this.init();
    }

}

customElements.define("custom-trait", Trait);