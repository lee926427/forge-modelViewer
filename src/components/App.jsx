import { useState } from "react";
import clsx from "clsx";
import { Viewer, UI, Model, Sprite } from "./forge";
import { DeviceDetail } from "./DeviceList";
import sensorImg from "../assets/images/sensor.png";
const devices = [
    {
        uuid: 1,
        position: { x: 0, y: 0, z: 0 },
        sensorModel: "BTE-2900x",
        meta: {
            labels: "Passive",
            sensorManufacturer: "Imaginary Co. Ltd.",
        },
    },
    {
        uuid: 12,
        position: { x: 100, y: 30, z: 30 },
        sensorModel: "BTG-5600x",
        meta: {
            labels: "In Service",
            sensorManufacturer: "FHNet Co. Ltd.",
        },
    },
];

function Video() {
    return <div>streaming Video</div>;
}

function Charts() {
    return (
        <div className="grid gap-y-3">
            <div className="w-full h-40 bg-slate-600 border rounded-md"></div>
            <div className="w-full h-40 bg-slate-600 border rounded-md"></div>
        </div>
    );
}

function App() {
    const [VisibleList, setVisibleList] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState(null);

    function onClickSensor({ dbId, data }) {
        console.log(dbId);
        if (dbId === 0) {
            setVisibleList(false);
        } else {
            setDeviceInfo(data);
            setVisibleList(true);
        }
    }

    return (
        <div className={clsx("App", "w-screen h-screen")}>
            <header></header>
            <main className={clsx("w-full h-full", "relative")}>
                <Viewer
                    clientId={import.meta.env.VITE_FORGE_CLIENT_ID}
                    clientSecret={import.meta.env.VITE_FORGE_CLIENT_SECRET}
                    scope={[
                        "data:write",
                        "data:read",
                        "bucket:create",
                        "bucket:delete",
                    ]}
                >
                    <UI name="buildingLayers" />
                    <Sprite
                        data={devices}
                        icon={sensorImg}
                        onClick={onClickSensor}
                    />
                    <Model ObjectId="urn:adsk.objects:os.object:test_buildings_model/center_20210218.rvt" />
                </Viewer>
                <div
                    className={clsx(
                        "h-screen w-2/12",
                        "absolute right-0 top-0",
                        "transition duration-300 ease-in-out",
                        "z-[1]",
                        {
                            "translate-x-0": VisibleList,
                            "translate-x-[460px]": !VisibleList,
                        }
                    )}
                >
                    {deviceInfo ? (
                        <DeviceDetail
                            className={clsx(
                                "h-full bg-slate-300",
                                "px-4",
                                "text-slate-700"
                            )}
                            title={deviceInfo.sensorModel}
                            header={() => <Video />}
                            main={() => <Charts />}
                        />
                    ) : null}
                </div>
            </main>
        </div>
    );
}

export default App;
