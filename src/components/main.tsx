import React, { Component, RefObject } from "react";
import { Menu } from "../menus";
import { AppData, RootEntity } from "../model/root";
import Embed from "./embed";
import initialData from "./initialData";
import { getSceneVersion } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/components/App";

import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { getData } from './utils'
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";

import { AppState } from "@excalidraw/excalidraw/types/types";

interface MainProps {
    rootRecord: RootEntity;
    menu: Menu;
    isCreation: boolean;
    creationUrl?: string;
}

interface MainState {
    data: AppData;
}

export default class Main extends Component<MainProps, MainState> {
    private excalidrawRef = React.createRef<ExcalidrawImperativeAPI>();

    private getInitialData = (): ImportedDataState => {
        const { rootRecord } = this.props;
        const data = getData(rootRecord);
        if (data === null) {
            return initialData;
        }
        return data;
    }
    private elements: string;
    private appState: string;
    private version: number;
    private initialData: ImportedDataState = this.getInitialData();
    private interval: NodeJS.Timeout;
    private saveToState = (elements: readonly ExcalidrawElement[], state: AppState) => {
        // Debouncing implementation
        // We update the component props
        // that will later be saved to Quip Record API via saveToRecords function
        // which is called every X milliseconds
        this.version = getSceneVersion(elements);
        this.elements = JSON.stringify(elements);
        this.appState = JSON.stringify(state);
    }



    constructor(props: MainProps) {
        super(props);
        const { rootRecord } = props;
        const data = rootRecord.getData();
        this.state = { data };
    }

    private saveToRecords = () => {
        const { rootRecord } = this.props;
        if (this.version === rootRecord.get('version')) {
            // not saving because is the same version
            return;
        }
        rootRecord.set('elements', this.elements);
        rootRecord.set('state', this.appState);
        rootRecord.set('version', this.version);
    }

    componentDidMount() {
        const { rootRecord } = this.props;

        // Save every third of a second
        this.interval = setInterval(this.saveToRecords, 300);
        // Set up the listener on the rootRecord (RootEntity)
        rootRecord.listen(this.updateOnExternalChange);
    }

    componentWillUnmount() {
        const { rootRecord } = this.props;
        rootRecord.unlisten(this.updateOnExternalChange);
        clearInterval(this.interval); // Release saving timer
    }

    /**
     * Update the app state using the RootEntity's AppData.
     * This component will render based on the values of `this.state.data`.
     * This function will set `this.state.data` using the RootEntity's AppData.
     */
    private updateOnExternalChange = () => {
        const { rootRecord, menu } = this.props;
        if (this.version === rootRecord.get('version')) {
            return;
        }
        // Update state, for later saving on debouncing function
        this.version = rootRecord.get('version')
        this.elements = rootRecord.get('elements')
        this.appState = rootRecord.get('state')
        // Update components
        this.excalidrawRef.current!.updateScene({
            elements: JSON.parse(this.elements),
            appState: JSON.parse(this.appState)
        });
    };

    render() {
        return (
            <div className={"root"}>
                <div className={"excalidraw-wrapper"}>
                    <Embed
                        excalidrawRef={this.excalidrawRef}
                        rootRecord={this.props.rootRecord}
                        onChange={this.saveToState}
                        initialData={this.initialData}
                    />
                </div>
            </div>
        );
    }
}
