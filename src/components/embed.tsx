import React, { useEffect, useRef } from "react";
import Excalidraw from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/components/App";
import quip from "quip-apps-api";
import { RootEntity } from "../model/root";
import { getData } from './utils'


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
                // TODO: check filename finishes with .excalidraw
                blob.onDataLoaded(blob => {
                    const data = blob.getData();
                    const string = new TextDecoder().decode(data);
                    const parsed = JSON.parse(string);
                    const elements = parsed.elements;
                    const appState = parsed.appState;

                    appState.scrollToContents = true;

                    props.rootRecord.set('elements', JSON.stringify(elements));
                    props.rootRecord.set('state', JSON.stringify(appState));

                    excalidrawRef.current!.updateScene({ elements, appState });
                });
            },
        );
        // I don't know why we need to return bool. 
        // Maybe is for error handling
        return true;

    }

    const exportToConsole = () => {
        const data = getData(props.rootRecord);
        if (data === null) {
            console.log('No data to download');
            return false;
        }
        const fileInfo = {
            "type": "excalidraw",
            "version": 2,
            "source": "https://excalidraw.com",
            ...data
        }
        console.log(JSON.stringify(fileInfo));
        console.log(
            'For editing, copy last message into an editor, ' +
            'save it with a .excalidraw extension. Then you ' +
            'can upload it to excalidraw.com as a normal export file');
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
                    label: "Import from Excalidraw file",
                    handler: importFile,
                    // Tried to receive the functions directly using this action
                    // Couldn't figure out how to obtain the blob
                    // actionId: quip.apps.DocumentMenuActions.SHOW_FILE_PICKER,
                    // actionStarted: () => { console.log('click on immport button'    ) },
                },
                {
                    id: 'Export to console',
                    label: "Export to console",
                    handler: exportToConsole,
                    // Tried to receive the functions directly using this action
                    // Couldn't figure out how to obtain the blob
                    // actionId: quip.apps.DocumentMenuActions.SHOW_FILE_PICKER,
                    // actionStarted: () => { console.log('click on immport button'    ) },
                },
            ],
            toolbarCommandIds: ['Import from file', 'Export to console'],
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
