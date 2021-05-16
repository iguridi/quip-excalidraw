import React, { useEffect, useRef } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/components/App";

import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";

import { AppState } from "@excalidraw/excalidraw/types/types";

type Props = {
    onChange: (elements: readonly ExcalidrawElement[], appState: AppState) => void;
    initialData: ImportedDataState;
};

export default function Embed(props: Props) {
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


    return (
        <div className="App">
            <div className="excalidraw-wrapper">
                <Excalidraw
                    ref={excalidrawRef}
                    initialData={props.initialData}
                    onChange={props.onChange}
                    onCollabButtonClick={() =>
                        window.alert("You clicked on collab button")
                    }
                    name="Custom name of drawing"
                />
            </div>
        </div>
    );
}
