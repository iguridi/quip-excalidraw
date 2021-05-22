import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import { RootEntity } from "../model/root";


export const getData: (rootRecord: RootEntity) => ImportedDataState | null = rootRecord => {
    let elements = rootRecord.get('elements');
    let appState = rootRecord.get('state');

    if (elements === undefined || appState === undefined) {
        // Happens on new diagrams, when no info is saved
        return null;
    }

    elements = JSON.parse(elements);
    appState = JSON.parse(appState);
    // Excalidraw calls .foreach on collaborators,
    // so we transform them to a type that allows for it
    appState.collaborators = new Map(Object.entries(appState.collaborators));
    return {
        elements,
        appState,
    }
}
