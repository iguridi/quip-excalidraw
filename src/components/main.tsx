import React, { Component, RefObject } from "react";
import { Menu } from "../menus";
import { AppData, RootEntity } from "../model/root";
import Embed from "./embed";
import initialData from "./initialData";

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
    private elements: string;
    private appState: string;
    private interval: NodeJS.Timeout;
    private onChange = (elements: readonly ExcalidrawElement[], state: AppState) => {
        // Debouncing implementation
        // We update the component props
        // that will later be saved to Quip Record API via saveState function
        // which is called every X milliseconds
        this.elements = JSON.stringify(elements);
        this.appState = JSON.stringify(state);
    }

    private initialData = (): ImportedDataState => {
        const { rootRecord } = this.props;
        const data = getData(rootRecord);
        if (data === null) {
            return initialData;
        }
        data.scrollToContent = true;
        return data;
    }

    constructor(props: MainProps) {
        super(props);
        const { rootRecord } = props;
        const data = rootRecord.getData();
        this.state = { data };
    }

    private saveState = () => {
        const { rootRecord } = this.props;
        rootRecord.set('elements', this.elements);
        rootRecord.set('state', this.appState);
    }

    componentDidMount() {
        // Set up the listener on the rootRecord (RootEntity). The listener
        // will propogate changes to the render() method in this component
        // using setState
        // process.stdout.write('waaa');
        const { rootRecord } = this.props;
        // Save every third of a second
        this.interval = setInterval(this.saveState, 300);
        // rootRecord.listen(this.refreshData_);
        // this.refreshData_();
    }

    componentWillUnmount() {
        // const { rootRecord } = this.props;
        // rootRecord.unlisten(this.refreshData_);
        clearInterval(this.interval); // Release saving timer
    }

    /**
     * Update the app state using the RootEntity's AppData.
     * This component will render based on the values of `this.state.data`.
     * This function will set `this.state.data` using the RootEntity's AppData.
     */
    // private refreshData_ = () => {
    //     const { rootRecord, menu } = this.props;
    //     const data = rootRecord.getData();
    //     // Update the app menu to reflect most recent app data
    //     menu.updateToolbar(data);
    //     this.setState({ data: rootRecord.getData() });
    // };

    render() {
        const { data } = this.state;
        const { isHighlighted } = data;
        return (
            <div className={"root"}>
                <div className={"excalidraw-wrapper"}>
                    <Embed
                        rootRecord={this.props.rootRecord}
                        onChange={this.onChange}
                        initialData={this.initialData()}
                    />
                </div>
            </div>
        );
    }
}
