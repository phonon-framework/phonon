interface IEventElement {
    target: HTMLElement | HTMLDocument;
    event: string;
}
interface IMainProps {
    element?: HTMLElement | string | null;
}
export default class Component {
    private name;
    private template;
    private props;
    private defaultProps;
    private id;
    private eventHandlers;
    private registeredElements;
    private elementListener;
    constructor(name: string, defaultProps: object, props: IMainProps);
    setTemplate(template: string): void;
    getTemplate(): string;
    getElement(): any;
    setElement(element: HTMLElement): void;
    getId(): string | null;
    uid(): string;
    getName(): string;
    getProps(): object;
    getProp(name: string): any;
    setProps(props: object): void;
    setProp(name: string, value: any): void;
    registerElements(elements: IEventElement[]): void;
    registerElement(element: IEventElement): void;
    unregisterElements(): void;
    unregisterElement(element: IEventElement): void;
    triggerEvent(eventName: string, detail?: {}, objectEventOnly?: boolean): void;
    preventClosable(): boolean;
    destroy(): void;
    onElementEvent(event: Event): void;
    private setEventsHandler;
    private onBeforeElementEvent;
}
export {};
