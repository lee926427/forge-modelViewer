import { useEffect, useContext, useRef, useState, Children } from "react";
import { ForgeContext } from "./context";
import * as THREE from "three";

function Sprite({
    backgroundColor = "#fff",
    icon = "",
    size = 36,
    data = [],
    onHover = () => {},
    onClick = () => {},
    children,
}) {
    const [visible, setVisible] = useState(null);
    const { viewer, dataVizExt } = useContext(ForgeContext);
    const DataVizCore = Autodesk.DataVisualization.Core;
    const viewableDataRef = useRef(null);

    async function registerSprite() {
        const viewableData = new DataVizCore.ViewableData();
        viewableData.spriteSize = size;

        data.forEach((datum, index) => {
            const spriteStyle = new DataVizCore.ViewableStyle(
                DataVizCore.ViewableType.SPRITE,
                new THREE.Color(backgroundColor),
                icon
            );

            const viewable = new DataVizCore.SpriteViewable(
                datum.position,
                spriteStyle,
                index
            );

            viewable.series = data;
            viewableData.addViewable(viewable);
        });

        await viewableData.finish();
        dataVizExt.addViewables(viewableData);
        viewableDataRef.current = viewableData;
    }

    /**
     * @param {{type: string; dbId: number; hovering: boolean; originalEvent:MouseEvent;}} event - forge mouse hovering event
     * @reference https://forge.autodesk.com/en/docs/dataviz/v1/developers_guide/examples/sprites/handling_sprite_events/#mouse-hovering-event
     */
    function showSensorInfo(event) {
        onHover(event);
    }

    /**
     * @param {{type: string; dbId: number; originalEvent:MouseEvent;}} event - forge mouse click event
     * @reference https://forge.autodesk.com/en/docs/dataviz/v1/developers_guide/examples/sprites/handling_sprite_events/#mouse-clicking-event
     */

    function scaleSprite(event) {
        event.hasStopped = true;
        const viewables = viewableDataRef.current.viewables;
        const viewable = viewables.find((v) => v.dbId === event.dbId);
        if (viewable && Object.hasOwn(viewable, "series")) {
            onClick(viewable.series.at(viewable._dbId));
        }
        // dataVizExt.invalidateViewables([event.dbId], (viewable) => {
        //     return {
        //         scale: 1.0, // Restore the viewable size
        //         url: "https://.../circle.svg",
        //     };
        // });
    }

    useEffect(() => {
        registerSprite();
        return () => {
            dataVizExt.removeAllViewables();
        };
    }, [viewer, dataVizExt]);

    useEffect(() => {
        viewer.addEventListener(DataVizCore.MOUSE_CLICK, scaleSprite);
        viewer.addEventListener(DataVizCore.MOUSE_HOVERING, showSensorInfo);
        return () => {
            viewer.removeEventListener(DataVizCore.MOUSE_CLICK, scaleSprite);
            viewer.removeEventListener(
                DataVizCore.MOUSE_HOVERING,
                showSensorInfo
            );
        };
    }, []);

    return <div>{children ? children(visible) : null}</div>;
}

export default Sprite;
