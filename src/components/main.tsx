import React, { Component } from "react";
import quip from "quip-apps-api";
import { menuActions, Menu } from "../menus";
import { AppData, RootEntity } from "../model/root";
import Embed from "./embed";
import { getSceneVersion } from "@excalidraw/excalidraw";

import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";

import {
    AppState,
    SceneData
} from "@excalidraw/excalidraw/types/types";
import initialData from "./initialData";

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
    // setupMenuActions_(rootRecord: RootEntity) {
    //     menuActions.toggleHighlight = () =>
    //         rootRecord.getActions().onToggleHighlight();
    // }

    private onChange = (elements: readonly ExcalidrawElement[], state: AppState) => {
        const { rootRecord } = this.props;
        const version = getSceneVersion(elements)
        if (version !== rootRecord.get('version') && version % 20 === 0) {  // Naive debouncing
            // console.log('wheet', getSceneVersion(elements), rootRecord.get('version'));
            console.log('yayaya', state);
            
            rootRecord.set('version', version);
            rootRecord.set('elements', JSON.stringify(elements));
            rootRecord.set('state', JSON.stringify(state));
        }
        // console.log("Elements wiii3:", rootRecord.get('elements'), "State : ", rootRecord.get('elements'))
        // console.log(rootRecord.get('elements'));
    }

    private initialData = (): ImportedDataState => {
        const { rootRecord } = this.props;
        const elements = JSON.parse(rootRecord.get('elements'));
        const appState = JSON.parse(rootRecord.get('state'));
        // Excalidraw calls .foreach on collaborators, so we transform them to a type that allows for it
        appState.collaborators = new Map(Object.entries(appState.collaborators));
        console.log('wjjj', appState);
        
        const data: ImportedDataState = {
            // elements: JSON.parse(rootRecord.get('elements')),
            // appState: JSON.parse(rootRecord.get('state')),
            // scrollToContent: true

            elements,
            // elements: [
            //     {
            //         type: "rectangle",
            //         version: 141,
            //         versionNonce: 361174001,
            //         isDeleted: false,
            //         id: "oDVXy8D6rom3H1-LLH2-f",
            //         fillStyle: "hachure",
            //         strokeWidth: 1,
            //         strokeStyle: "solid",
            //         roughness: 1,
            //         opacity: 100,
            //         angle: 0,
            //         x: 100.50390625,
            //         y: 93.67578125,
            //         strokeColor: "#000000",
            //         backgroundColor: "transparent",
            //         width: 186.47265625,
            //         height: 141.9765625,
            //         seed: 1968410350,
            //         groupIds: [],
            //         strokeSharpness: "round",
            //         boundElementIds: null
            //     },
            // ],
            appState,
            // appState: { viewBackgroundColor: "#CCC", currentItemFontFamily: 1 },
            scrollToContent: true
        }
        console.log('wooo', data);

        return data;
    }

    constructor(props: MainProps) {
        super(props);
        const { rootRecord } = props;
        // this.setupMenuActions_(rootRecord);
        const data = rootRecord.getData();
        this.state = { data };
    }

    componentDidMount() {
        // Set up the listener on the rootRecord (RootEntity). The listener
        // will propogate changes to the render() method in this component
        // using setState
        // process.stdout.write('waaa');
        // quip.apps.enableResizing({
        //     minWidth: 200,
        //     minHeight: 200,
        //     maintainAspectRatio: false,
        // });
        const { rootRecord } = this.props;
        rootRecord.listen(this.refreshData_);
        this.refreshData_();
    }

    componentWillUnmount() {
        const { rootRecord } = this.props;
        rootRecord.unlisten(this.refreshData_);
    }

    /**
     * Update the app state using the RootEntity's AppData.
     * This component will render based on the values of `this.state.data`.
     * This function will set `this.state.data` using the RootEntity's AppData.
     */
    private refreshData_ = () => {
        const { rootRecord, menu } = this.props;
        const data = rootRecord.getData();
        // Update the app menu to reflect most recent app data
        menu.updateToolbar(data);
        this.setState({ data: rootRecord.getData() });
    };

    render() {
        const { data } = this.state;
        const { isHighlighted } = data;
        return (
            <div className={"root"}>
                <div className={"excalidraw-wrapper"}>
                    {/* <h1>Hello, World4!</h1>
                        <p>App Data:</p> */}
                    <Embed onChange={this.onChange} initialData={this.initialData()} />
                    {/* <pre>{JSON.stringify(data)}</pre> */}
                </div>
            </div>
        );
    }
}
