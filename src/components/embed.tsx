import React, { useEffect, useState, useRef } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/components/App";
import InitialData from "./initialData";

import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
    AppState,
    SceneData
} from "@excalidraw/excalidraw/types/types";

export default function Embed() {
    const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);

    useEffect(() => {
        const onHashChange = () => {
            const hash = new URLSearchParams(window.location.hash.slice(1));
            const libraryUrl = hash.get("addLibrary");
            if (libraryUrl) {
                excalidrawRef.current!.importLibrary(libraryUrl, hash.get("token"));
            }
        };
        window.addEventListener("hashchange", onHashChange, false);
        return () => {
            window.removeEventListener("hashchange", onHashChange);
        };
    }, []);
    const updateScene = () => {
        const sceneData: SceneData = {
            elements: [
                {
                    type: "rectangle",
                    version: 141,
                    versionNonce: 361174001,
                    isDeleted: false,
                    id: "oDVXy8D6rom3H1-LLH2-f",
                    fillStyle: "hachure",
                    strokeWidth: 1,
                    strokeStyle: "solid",
                    roughness: 1,
                    opacity: 100,
                    angle: 0,
                    x: 100.50390625,
                    y: 93.67578125,
                    strokeColor: "#c92a2a",
                    backgroundColor: "transparent",
                    width: 186.47265625,
                    height: 141.9765625,
                    seed: 1968410350,
                    groupIds: [],
                    strokeSharpness: "round",
                    boundElementIds: null
                }
            ],
            appState: {
                // viewBackgroundColor: "#edf2ff"
            }
        };
        excalidrawRef.current!.updateScene(sceneData);
    };

    return (
        <div className="App">
            {/* <h1> Excalidraw Example</h1> */}
            <div className="excalidraw-wrapper">
                <Excalidraw
                    ref={excalidrawRef}
                    initialData={InitialData}
                    onChange={(elements: readonly ExcalidrawElement[], state: AppState) =>
                        console.log("Elements :", elements, "State : ", state)
                    }
                    onPointerUpdate={(payload) => console.log(payload)}
                    onCollabButtonClick={() =>
                        window.alert("You clicked on collab button")
                    }
                    name="Custom name of drawing"
                />
            </div>
        </div>
    );
}
