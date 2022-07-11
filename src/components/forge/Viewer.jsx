import { useRef, useEffect, useState } from "react";
import { ForgeContext } from "./context";
import { auth } from "../../services/forge";

import "./extensions";

import "forge-dataviz-iot-react-components/dist/main.bundle.css";

function createViewer(targetRef, options) {
    return new Promise((resolve, reject) => {
        const viewer = new Autodesk.Viewing.GuiViewer3D(targetRef, {
            extensions: ["MyAwesomeExtension"],
        });
        const stateCode = viewer.start(
            undefined,
            undefined,
            undefined,
            undefined,
            options
        );
        if (stateCode !== 0)
            reject("Failed to create a Viewer: WebGL not supported.");
        resolve(viewer);
    });
}

async function loadModel(viewer, safeUrn) {
    const { status, progress, derivatives } =
        await translateFile.checkTranslationJob(safeUrn);

    if (status === "failed") {
        for (const messageItem of derivatives[0].messages) {
            alert(messageItem.message);
        }
        return;
    }

    // Autodesk.Viewing.Document.load(
    //     'urn:' + safeUrn,
    //     onDocumentLoadSuccess,
    //     onDocumentLoadFailure
    // );

    // function onDocumentLoadSuccess(viewerDocument) {
    //     const defaultModel = viewerDocument.getRoot().getDefaultGeometry(true);
    //     viewer.loadDocumentNode(viewerDocument, defaultModel);
    // }

    // function onDocumentLoadFailure() {
    //     console.error("Failed fetching Forge manifest");
    // }
}

export default function Viewer({ onModelLoaded, children }) {
    const container = useRef(null);
    const forgeViewer = useRef(null);
    const DataVisualization = useRef(null);
    const [urnModels, setUrnModels] = useState([]);

    const av = Autodesk.Viewing;

    function onModelLoaded(event) {
        const viewer = forgeViewer.current;

        viewer.removeEventListener(av.GEOMETRY_LOADED_EVENT, onModelLoaded);

        if (onModelLoaded) {
            onModelLoaded(viewer, event);
        }
    }

    useEffect(() => {
        const options = {
            env: "AutodeskProduction",
            api: "streamingV2",
            getAccessToken: async (onTokenReady) => {
                const { access_token, expires_in } =
                    await auth.authClientTwoLegged("<CLIENT_SECRET>", [
                        "data:write",
                        "data:read",
                        "bucket:create",
                        "bucket:delete",
                    ]);
                onTokenReady(access_token, expires_in);
            },
        };

        Autodesk.Viewing.Initializer(options, async () => {
            const viewer = await createViewer(container.current, options);
            const [DataVisualization] = await Promise.allSettled([
                viewer.loadExtension("Autodesk.DataVisualization"),
            ]);

            viewer.addEventListener(av.GEOMETRY_LOADED_EVENT, onModelLoaded, {
                once: true,
            });

            forgeViewer.current = viewer;
            DataVisualization.current = DataVisualization;

            loadModel(
                viewer,
                "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdF9idWlsZGluZ3NfbW9kZWwvY2VudGVyXzIwMjEwMjE4LnJ2dA"
            );
        });

        return () => {
            if (forgeViewer.current) {
                forgeViewer.current.finish();
            }
        };
    }, [container.current, urnModels]);

    return (
        <div ref={container} className="w-screen h-screen">
            <ForgeContext.Provider
                value={{
                    viewer: forgeViewer.current,
                    DataVisualization: DataVisualization.current,
                    pushUrnModel: (urn) =>
                        setUrnModels((urns) => [...urns, urn]),
                }}
            >
                {children}
            </ForgeContext.Provider>
        </div>
    );
}
