import Component from '../component';
interface IProps {
    element: HTMLElement | string;
    container?: HTMLElement | HTMLDocument | string;
    toggle?: boolean;
    setupContainer?: boolean;
    closableKeyCodes?: [27];
    aside?: {
        md: false;
        lg: true;
        xl: true;
    };
}
export default class OffCanvas extends Component {
    static attachDOM(): void;
    private currentWidthName;
    private animate;
    private showAside;
    private directions;
    private direction;
    private sizes;
    private backdropSelector;
    constructor(props: IProps);
    checkDirection(): void;
    checkWidth(): void;
    setAside(sizeName: any): void;
    onElementEvent(event: KeyboardEvent): void;
    isVisible(): boolean;
    show(): boolean;
    hide(): boolean;
    toggle(): boolean;
    createBackdrop(): void;
    getBackdrop(): HTMLElement | null;
    removeBackdrop(): void;
    attachEvents(): void;
    detachEvents(): void;
    private getContainer;
    private getShowClass;
}
export {};
