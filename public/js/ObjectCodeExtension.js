
class ObjectCodeExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('ObjectCodeExtension has been loaded');
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
        console.log('ObjectCodeExtension has been unloaded');
        return true;
    }


    // loadObjectCode(elements){
    //     var _this = this
    //     // _this.panel.removeAllProperties();
    //     elements.forEach((element) => {
    //         fetch('http://localhost:3000/boiler' )
    //             .then((res) => res.json(), console.log(res.json()))
    //             .then((data) => {
    //                 this.panel.addProperty('Name', data.name, element.name);
    //                 this.panel.addProperty('Component Id', data.componentId, element.componentId);
    //                 this.panel.addProperty('Outer Diameter', data.outerDiameter, element.outerDiameter);
    //                 this.panel.addProperty('Design Temperature', data.designTemp, element.designTemp);
    //                 this.panel.addProperty('Component Type', data.componentType, element.componentType);
    //                 this.panel.addProperty('Area', data.area, element.area);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             });

    //     })

    // };



    getAllLeafComponents(callback) {
        this.viewer.getObjectTree(function (tree) {
            let leaves = [];
            tree.enumNodeChildren(tree.getRootId(), function (dbId) {
                if (tree.getChildCount(dbId) === 0) {
                    leaves.push(dbId);
                }
            }, true);
            callback(leaves);
            //console.log(leaves);
        });
    }


 
    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('ObjectCodeExtensionButton');
        this._button.onClick = (ev) => {
           
            // Check if the panel is created or not
            if (this._panel == null) {
                this._panel = new ObjectCodePanel(this.viewer, this.viewer.container, 'ObjectCodePanel', 'Post to MongoDB');
            }

            // Show/hide docking panel
            this._panel.setVisible(!this._panel.isVisible());

            // If panel is NOT visible, exit the function
            if (!this._panel.isVisible())
            return;

            this.getAllLeafComponents((dbIds) => {
                // Now for leaf components, let's get some properties and count occurrences of each value
                const filteredProps = ['Name'];

                 // Get only the properties we need for the leaf dbIds
                 this.viewer.model.getBulkProperties(dbIds, filteredProps, (elements) =>{
                    console.log(elements);
                
                    if (elements.length > 0) 
                    {
                        elements.forEach((element) => {
                            fetch('http://localhost:3000/boiler' )
                                .then((res) => res.json() )
                                .then((data) => {
                                    console.log(data);
                                    this._panel.addProperty('Name', data.name, element.name);
                                    this._panel.addProperty('Component Id', data.componentId, element.componentId);
                                    this._panel.addProperty('Outer Diameter', data.outerDiameter, element.outerDiameter);
                                    this._panel.addProperty('Design Temperature', data.designTemp, element.designTemp);
                                    this._panel.addProperty('Component Type', data.componentType, element.componentType);
                                    this._panel.addProperty('Area', data.area, element.area);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                
                        })
                    }

                 })
                
            });


        };
        this._button.setToolTip('Object Code Extension');
        this._button.addClass('ObjectCodeExtensionIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('ObjectCodeExtension', ObjectCodeExtension);


class ObjectCodePanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;
    }
}