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
    // TODO: Tried this, didn't do anything. Should have added toolbarCommandIds to
    // to add this commands. I now this now, but it already works, 
    // so I'm leaving this for a future refactor
    // menuCommands: [
    //     // {
    //     //     id: quip.apps.DocumentMenuCommands.MENU_MAIN,
    //     // },
    //     {
    //         id: 'no cachou nadai',
    //         label: "Import from Wordpress Export",
    //         handler: () => { console.log('click on impport button'); return true },
    //     },
    //     {
    //         id: quip.apps.DocumentMenuActions.SHOW_FILE_PICKER,
    //         label: "Import from Wordpress Export",
    //         handler: () => { console.log('click on immport button'); return true },
    //     },
    // ],
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
