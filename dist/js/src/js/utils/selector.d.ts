declare function closest(element: HTMLElement, selector: string): HTMLElement | null;
declare function attrConfig(element: any): null | object;
declare function removeClasses(element: HTMLElement, classList: string[], prefix?: string | null): void;
export declare function isElement(node: Node): boolean;
declare const _default: {
    attrConfig: typeof attrConfig;
    removeClasses: typeof removeClasses;
    closest: typeof closest;
    isElement: typeof isElement;
};
export default _default;
