import { Viewer, UI, Model } from "./forge";

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
                <UI />
                <Model ObjectId="urn:adsk.objects:os.object:test_buildings_model/center_20210218.rvt" />
            </Viewer>
        </div>
    );
}

export default App;
