import React, { useEffect, useRef } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/components/App";
import quip from "quip-apps-api";
import { RootEntity } from "../model/root";


import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";

import { AppState } from "@excalidraw/excalidraw/types/types";

type Props = {
    onChange: (elements: readonly ExcalidrawElement[], appState: AppState) => void;
    initialData: ImportedDataState;
    rootRecord: RootEntity;
};

export default function Embed(props: Props) {
    const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);

    const importFile = () => {
        quip.apps.showFilePicker(
            () => console.log('files picked'),
            blobWithThumbnails => {
                const blob = blobWithThumbnails[0].blob;
                const filename = blob.getFilename();
                // TODO: check filename finish with .excalidraw
                console.log('files uploaaded', filename)
                blob.onDataLoaded(blob => {
                    const data = blob.getData();
                    // console.log('daata', data);
                    const string = new TextDecoder().decode(data);
                    // console.log('textou', string);
                    const parsed = JSON.parse(string);
                    const elements = parsed.elements;
                    const appState = parsed.appState;
                    if (appState.gridSize === null) {
                        delete appState.gridSize;
                    }
                    appState.scrollToContents = true;
                    console.log('not null??', elements, appState);
                    // const rootRecord = quip.apps.getRootRecord() as RootEntity;
                    props.rootRecord.set('elements', JSON.stringify(elements));
                    // rootRecord.set('state', JSON.stringify(appState));
                    excalidrawRef.current!.updateScene({ elements });
                    // restoreElements(elements);
                    // restoreAppState({}, appState);
                    console.log('se actualizoo?');
                });
            },
        );
        // I don't know why we need to return bool. 
        // Maybe is for error handling
        return true; 

    }

    useEffect(() => {
        const onHashChange = () => {
            const hash = new URLSearchParams(window.location.hash.slice(1));
            const libraryUrl = hash.get("addLibrary");
            if (libraryUrl) {
                excalidrawRef.current!.importLibrary(libraryUrl, hash.get("token"));
            }
        };
        // TODO: This shouldn't be here, but I also need the excalidrawRef
        // First option is to create the toolbar in root.ts and update the handler function at runtime
        // Second option is to create the excalidrawRef also in root.ts
        quip.apps.updateToolbar({
            menuCommands: [
                {
                    id: 'Import from file',
                    label: "Import from Wordpress Export",
                    handler: importFile,
                    // actionId: quip.apps.DocumentMenuActions.SHOW_FILE_PICKER,
                    // actionStarted: () => { console.log('click on immport button'    ) },
                },
            ],
            toolbarCommandIds: ['Import from file'],
        });
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
