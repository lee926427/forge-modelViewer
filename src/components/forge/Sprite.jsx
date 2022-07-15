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
                index + 1 //場景預設 dbId = 0,所以加1
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

    function onSpriteClicked(event) {
        event.hasStopped = true;

        if (event.dbId === 0)
            onClick({
                dbId: event.dbId,
                data: null,
            });

        dataVizExt.invalidateViewables([event.dbId], (viewable) => {
            onClick({
                dbId: event.dbId,
                data: viewable.series.at(viewable._dbId - 1),
            });
            return {
                ...viewable._style,
                scale: 2,
                color: { r: 1.0, g: 0.753, b: 0.796 },
            };
        });
    }

    function onSpriteClickedOut(event) {
        event.hasStopped = true;
        dataVizExt.invalidateViewables([event.dbId], (viewable) => {
            console.log("click out", event);
            return {
                ...viewable._style,
                scale: 1,
                color: { r: 1.0, g: 1, b: 1 },
            };
        });
    }

    useEffect(() => {
        registerSprite();
        return () => {
            dataVizExt.removeAllViewables();
        };
    }, [viewer, dataVizExt]);

    useEffect(() => {
        viewer.addEventListener(DataVizCore.MOUSE_CLICK, onSpriteClicked);
        viewer.addEventListener(
            DataVizCore.MOUSE_CLICK_OUT,
            onSpriteClickedOut
        );
        viewer.addEventListener(DataVizCore.MOUSE_HOVERING, showSensorInfo);
        return () => {
            viewer.removeEventListener(
                DataVizCore.MOUSE_CLICK,
                onSpriteClicked
            );
            viewer.removeEventListener(
                DataVizCore.MOUSE_HOVERING,
                showSensorInfo
            );
        };
    }, []);

    return <div>{children ? children(visible) : null}</div>;
}

export default Sprite;
