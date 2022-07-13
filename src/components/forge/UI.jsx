import { useEffect, useContext } from "react";
import { ForgeContext } from "./context";

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

export default function UiLayer({ name, children }) {
    const { registerExtension } = useContext(ForgeContext);

    useEffect(() => {
        extensionInterface.prototype = Object.create(
            Autodesk.Viewing.Extension.prototype
        );
        extensionInterface.prototype.constructor = extensionInterface;
        Autodesk.Viewing.theExtensionManager.registerExtension(
            name,
            extensionInterface
        );
        registerExtension(name);
    }, []);

    return <div id="gui">{children}</div>;
}
