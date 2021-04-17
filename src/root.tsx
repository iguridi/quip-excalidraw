import quip from "quip-apps-api";
import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/main";
import {Menu} from "./menus";
import {RootEntity} from "./model/root";

quip.apps.registerClass(RootEntity, RootEntity.ID);

const menu = new Menu();


declare global {
    interface Window { EXCALIDRAW_ASSET_PATH: any; }
}

window.EXCALIDRAW_ASSET_PATH = "assets";


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
