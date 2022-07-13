import { Viewer, UI, Model, Sprite } from "./forge";
const devices = [
    {
        uuid: 1,
        position: { x: 0, y: 0, z: 0 },
        data: {
            labels: ["In Service", "Passive"],
            sensorManufacturer: "Imaginary Co. Ltd.",
            sensorModel: "BTE-2900x",
        },
    },
    {
        uuid: 12,
        position: { x: 100, y: 30, z: 30 },
        data: {
            labels: ["In Service"],
            sensorManufacturer: "FHNet Co. Ltd.",
            sensorModel: "BTG-5600x",
        },
    },
];
function App() {
    return (
        <div className="App">
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
                    icon="./src/assets/images/sensor.png"
                    onClick={(e) => console.log(e)}
                />
                <Model ObjectId="urn:adsk.objects:os.object:test_buildings_model/center_20210218.rvt" />
            </Viewer>
        </div>
    );
}

export default App;
