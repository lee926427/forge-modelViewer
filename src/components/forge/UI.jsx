import { useEffect } from "react";
export default function UiLayer({ name, children }) {
    function extensionInterface(viewer, options) {
        Autodesk.Viewing.Extension.call(this, viewer, options);
    }
    extensionInterface.prototype.load = function () {
        this.viewer.setLightPreset(6);
        this.viewer.setEnvMapBackground(true);

        // Ensure the model is centered
        this.viewer.fitToView();

        return true;
    };

    extensionInterface.prototype.unload = function () {
        // nothing yet
    };

    useEffect(() => {
        extensionInterface.prototype = Object.create(
            Autodesk.Viewing.Extension.prototype
        );
        extensionInterface.prototype.constructor = extensionInterface;
        Autodesk.Viewing.theExtensionManager.registerExtension(
            name,
            extensionInterface
        );
    }, []);

    return <div id="gui">{children}</div>;
}
