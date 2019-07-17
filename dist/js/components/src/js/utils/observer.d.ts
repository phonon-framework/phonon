import Component from '../component';
export interface IMutatorSubscriber {
    componentClass: string;
    onAdded?: (element: HTMLElement, create: (component: Component) => void) => void;
    onRemoved?: (element: HTMLElement, remove: (className: string, element: HTMLElement) => void) => void;
}
declare function subscribe(subscriber: IMutatorSubscriber): void;
declare const _default: {
    subscribe: typeof subscribe;
    getComponent: (component: string | Component, options: any) => any;
};
export default _default;
