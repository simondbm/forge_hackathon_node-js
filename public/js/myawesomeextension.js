class MyAwesomeExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('MyAwesomeExtensions has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('MyAwesomeExtensions has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('myAwesomeExtensionButton');
        this._button.onClick = (ev) => {
            // Execute an action here
            const selection = this.viewer.getSelection();
            console.log(selection);
            this.viewer.clearSelection();

            // Anything selected?
            if (selection.length > 0) {
                let isolated = [];
                // Iterate through the list of selected dbIds
                selection.forEach((dbId) => {

                    var green = new THREE.Vector4(0, 0.5, 0, 0.5);
                    this.viewer.setThemingColor(3,green);


                    // Get properties of each dbId
                    // this.viewer.getProperties(dbId, (props) => {
                    //     // Output properties to console
                    //     console.log(props);
                    //     // Ask if want to isolate
                    //     if (confirm(`Isolate ${props.name} (${props.externalId})?`)) {
                    //         isolated.push(dbId);
                    //         this.viewer.isolate(isolated);
                    //     }
                    // });
                });
            } else {
                // If nothing selected, restore
                this.viewer.isolate(0);
            }
            
        };
        this._button.setToolTip('My Awesome Extension');
        this._button.addClass('myAwesomeExtensionIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', MyAwesomeExtension);
