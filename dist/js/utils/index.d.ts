declare const _default: {
    sleep: (timeout: number) => Promise<unknown>;
    Event: {
        TOUCH_SCREEN: boolean;
        NETWORK_ONLINE: string;
        NETWORK_OFFLINE: string;
        NETWORK_RECONNECTING: string;
        NETWORK_RECONNECTING_SUCCESS: string;
        NETWORK_RECONNECTING_FAILURE: string;
        SHOW: string;
        SHOWN: string;
        HIDE: string;
        HIDDEN: string;
        HASH: string;
        START: string;
        MOVE: string;
        END: string;
        CANCEL: string | null;
        CLICK: string;
        TRANSITION_START: string;
        TRANSITION_END: string;
        ANIMATION_START: string;
        ANIMATION_END: string;
        ITEM_SELECTED: string;
    };
    Dispatch: {
        elementEvent: (domElement: any, eventName: any, moduleName: any, detail?: {}) => void;
        pageEvent: (eventName: any, pageName: any, detail?: {}) => void;
        winDocEvent: (eventName: any, moduleName: any, detail?: {}) => void;
    };
    Selector: {
        attrConfig: (element: any) => object | null;
        removeClasses: (element: HTMLElement, classList: string[], prefix?: string | null) => void;
        closest: (element: HTMLElement, selector: string) => HTMLElement | null;
        isElement: typeof import("./selector").isElement;
    };
    Observer: {
        subscribe: (subscriber: import("./observer").IMutatorSubscriber) => void;
        getComponent: (component: string | import("../component").default, options: any) => any;
    };
};
export default _default;
