import Component from '../component';
declare function addComponent(component: Component): void;
declare function removeComponent(componentName: string, element: HTMLElement): void;
declare function getComponent(component: string | Component, options: any): any;
declare const _default: {
    addComponent: typeof addComponent;
    getComponent: typeof getComponent;
    removeComponent: typeof removeComponent;
};
export default _default;
