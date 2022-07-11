import { Viewer, UI, Model } from "./forge";

function App() {
    return (
        <div className="App">
            <Viewer>
                <UI />
                <Model urn="urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdF9idWlsZGluZ3NfbW9kZWwvJUU0JUI4JUFEJUU1JUE0JUFFXzIwMjEwMjE4LnJ2dA" />
            </Viewer>
        </div>
    );
}

export default App;
