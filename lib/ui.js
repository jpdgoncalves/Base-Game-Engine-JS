MH.scope(() =>{

    const ui = MH.create("engine.ui");

    /**
     * @type {CanvasRenderingContext2D}
     */
    let MENU_CONTEXT;

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    function setContext(context) {
        const canvas = context.canvas;
        const {width, height} = canvas;
        

        MENU_CONTEXT = context;
    }

    class UIElement {

    }

    ui.setContext = setContext;
    ui.UIElement = UIElement;

});