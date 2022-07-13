import { useRef, useEffect, useState, useCallback } from "react";
import { ForgeContext } from "./context";
import { auth } from "../../services/forge";
import { encode } from "js-base64";
import { toSafeBase64 } from "../../utils";
// import "./extensions";

import "forge-dataviz-iot-react-components/dist/main.bundle.css";

async function loadModel(viewer, objectId) {
    const base64 = encode(objectId);
    const safeUrn = toSafeBase64(base64);
    Autodesk.Viewing.Document.load(
        "urn:" + safeUrn,
        onDocumentLoadSuccess,
        onDocumentLoadFailure
    );

    function onDocumentLoadSuccess(viewerDocument) {
        const items = viewerDocument
            .getRoot()
            .search({ type: "geometry", role: "3d" }, true);
        const url = viewerDocument.getViewablePath(items[0]);
        viewer.loadModel(url, {
            acmSessionId: viewerDocument.getAcmSessionId(url),
        });
    }

    function onDocumentLoadFailure() {
        console.error("Failed fetching Forge manifest");
    }
}

export default function Viewer({
    clientId,
    clientSecret,
    scope,
    onModelLoaded,
    children,
}) {
    const av = Autodesk.Viewing;
    const viewerRef = useRef(null);
    const [dataVizExt, setDataVizExt] = useState(null);
    const [urnModels, setUrnModels] = useState([]);
    const [extensions, setExtensions] = useState([]);

    function onModelLoaded(event) {
        // const viewer = viewer;
        // viewer.removeEventListener(av.GEOMETRY_LOADED_EVENT, onModelLoaded);
        // if (onModelLoaded) {
        //     onModelLoaded(viewer, event);
        // }
    }

    const options = {
        env: "AutodeskProduction",
        api: "streamingV2",
        getAccessToken: async (onTokenReady) => {
            const { access_token, expires_in } = await auth.authClientTwoLegged(
                clientId,
                clientSecret,
                scope
            );
            onTokenReady(access_token, expires_in);
        },
    };

    const containerRef = useCallback((nodeRef) => {
        const guiViewerOptions = {};

        if (extensions.length !== 0) {
            guiViewerOptions.extensions = extensions;
        }

        const viewer = new Autodesk.Viewing.GuiViewer3D(
            nodeRef,
            guiViewerOptions
        );
        const stateCode = viewer.start(
            undefined,
            undefined,
            undefined,
            undefined,
            options
        );

        if (stateCode !== 0) {
            console.error("");
            return;
        }

        viewerRef.current = viewer;
    }, []);

    useEffect(() => {
        Autodesk.Viewing.Initializer(options, async () => {
            viewerRef.current.addEventListener(
                av.GEOMETRY_LOADED_EVENT,
                onModelLoaded,
                {
                    once: true,
                }
            );

            for (const model of urnModels) {
                console.log("loading urmId:", model);
                loadModel(viewerRef.current, model);
            }

            const [DataVisualization] = await Promise.allSettled([
                viewerRef.current.loadExtension("Autodesk.DataVisualization"),
            ]);

            setDataVizExt(DataVisualization.value);
        });

        return () => {
            // if (viewerRef.current) viewerRef.current.finish();
            // console.log("before unmount", viewerRef.current);
            // Autodesk.Viewing.shutdown();
        };
    }, [viewerRef, urnModels]);

    const isReady = viewerRef.current ? (
        <ForgeContext.Provider
            value={{
                viewer: viewerRef.current,
                dataVizExt,
                pushUrnModel: (urn) => setUrnModels((urns) => [...urns, urn]),
                registerExtension: (extensionName) =>
                    setExtensions((extensions) => [
                        ...extensions,
                        extensionName,
                    ]),
            }}
        >
            {children}
        </ForgeContext.Provider>
    ) : (
        <div>Initializing...</div>
    );

    return (
        <div ref={containerRef} className="w-screen h-screen">
            {isReady}
        </div>
    );
}
