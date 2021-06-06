import quip from "quip-apps-api";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/components/App";
import { RootEntity } from "../model/root";
import { getData } from '../components/utils'


export const createToolbar = (
    rootRecord: RootEntity,
    excalidrawRef: React.RefObject<ExcalidrawImperativeAPI>
) => quip.apps.updateToolbar({
    menuCommands: [
        {
            id: 'Import from file',
            label: "Import from Excalidraw file",
            handler: () => importFile(rootRecord, excalidrawRef),
            // Tried to receive the functions directly using this action
            // Couldn't figure out how to obtain the blob
            // actionId: quip.apps.DocumentMenuActions.SHOW_FILE_PICKER,
            // actionStarted: () => { console.log('click on immport button'    ) },
        },
        {
            id: 'Export to console',
            label: "Export to console",
            handler: () => exportToConsole(rootRecord),
            // Tried to receive the functions directly using this action
            // Couldn't figure out how to obtain the blob
            // actionId: quip.apps.DocumentMenuActions.SHOW_FILE_PICKER,
            // actionStarted: () => { console.log('click on immport button'    ) },
        },
    ],
    toolbarCommandIds: ['Import from file', 'Export to console'],
});



const exportToConsole = (rootRecord: RootEntity) => {
    const data = getData(rootRecord);
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


const importFile = (
    rootRecord: RootEntity,
    excalidrawRef: React.RefObject<ExcalidrawImperativeAPI>
) => {
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

                rootRecord.set('elements', JSON.stringify(elements));
                rootRecord.set('state', JSON.stringify(appState));

                excalidrawRef.current!.updateScene({ elements, appState });
                excalidrawRef.current!.setScrollToContent(elements);
            });
        },
    );
    // I don't know why we need to return bool. 
    // Maybe is for error handling
    return true;

}