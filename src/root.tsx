import quip from "quip-apps-api";
import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/main";
import { Menu } from "./menus";
import { RootEntity } from "./model/root";


class Root extends quip.apps.RootRecord {
    static getProperties = () => ({
        elements: "string",
        state: "string",
        // Keep just to get rid of an alert. 
        // It is not used anymore, so just delete it
        version: "number",
    })
}

quip.apps.registerClass(Root, "root");

const menu = new Menu();


declare global {
    interface Window { EXCALIDRAW_ASSET_PATH: any; }
}

window.EXCALIDRAW_ASSET_PATH = "assets";

// quip.apps.enableResizing({
//     minWidth: 200,
//     minHeight: 200,
//     maintainAspectRatio: false,
// });
quip.apps.initialize({
    initializationCallback: function (
        rootNode: Element,
        params: {
            isCreation: boolean;
            creationUrl?: string;
        }
    ) {
        const rootRecord = quip.apps.getRootRecord() as RootEntity;
        ReactDOM.render(
            <Main
                rootRecord={rootRecord}
                menu={menu}
                isCreation={params.isCreation}
                creationUrl={params.creationUrl}
            />,
            rootNode
        );
    },
});
