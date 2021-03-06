import React, { useEffect, useState, RefObject } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/components/App";
import quip from "quip-apps-api";
import { RootEntity } from "../model/root";
import { createToolbar } from '../utils/toolbar'

import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";

import { AppState } from "@excalidraw/excalidraw/types/types";

type Props = {
    onChange: (elements: readonly ExcalidrawElement[], appState: AppState) => void;
    initialData: ImportedDataState;
    rootRecord: RootEntity;
    excalidrawRef: RefObject<ExcalidrawImperativeAPI>;
};


export default function Embed(props: Props) {
    const excalidrawRef = props.excalidrawRef;

    const [focused, setFocus] = useState(false);

    const canEdit = quip.apps.isDocumentEditable();

    quip.apps.addEventListener(
        quip.apps.EventType.FOCUS,
        () => setFocus(true)
    );
    quip.apps.addEventListener(
        quip.apps.EventType.BLUR,
        () => setFocus(false)
    );

    // Set in and out of view mode, depending on app focus 
    // and edit permissions for the document
    let viewMode = false;
    if (!focused) {
        viewMode = true;
    }
    if (!canEdit) {
        viewMode = true;
    }

    useEffect(() => {
        // TODO: This shouldn't be here, but I also need the excalidrawRef
        // First option is to create the toolbar in root.ts and update the handler function at runtime
        // Second option is to create the excalidrawRef also in root.ts        
        createToolbar(props.rootRecord, excalidrawRef)
    }, []);

    return (
        <div className="App">
            <div className="excalidraw-wrapper">
                <Excalidraw
                    ref={excalidrawRef}
                    initialData={props.initialData}
                    onChange={props.onChange}
                    name="Custom name of drawing"
                    viewModeEnabled={viewMode}
                    UIOptions={{
                        canvasActions: {
                            saveAsScene: false,
                            saveScene: false,
                            loadScene: false,
                            export: false,
                            clearCanvas: false,
                            changeViewBackgroundColor: false
                        }
                    }}
                />
            </div>
        </div>
    );
}
