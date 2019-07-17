declare function elementEvent(domElement: any, eventName: any, moduleName: any, detail?: {}): void;
declare function pageEvent(eventName: any, pageName: any, detail?: {}): void;
declare function winDocEvent(eventName: any, moduleName: any, detail?: {}): void;
declare const _default: {
    elementEvent: typeof elementEvent;
    pageEvent: typeof pageEvent;
    winDocEvent: typeof winDocEvent;
};
export default _default;
