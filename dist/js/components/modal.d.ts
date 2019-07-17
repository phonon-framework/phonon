import Component from '../component';
interface IModalButton {
    class: string;
    event: string;
    text: string;
    dismiss: boolean;
}
export interface IProps {
    element?: HTMLElement | string;
    title?: null | string;
    message?: null | string;
    cancelable?: boolean;
    type?: null | string;
    background?: null | string;
    cancelableKeyCodes?: number[];
    buttons?: IModalButton[];
    center?: boolean;
}
export default class Modal extends Component {
    static attachDOM(): void;
    private backdropSelector;
    private elementGenerated;
    constructor(props: IProps, autoCreate?: boolean);
    build(): void;
    show(): boolean;
    hide(): boolean;
    onElementEvent(event: KeyboardEvent): void;
    private setBackgroud;
    private buildButton;
    private buildBackdrop;
    private getBackdrop;
    private removeTextBody;
    private removeFooter;
    private center;
    private attachEvents;
    private detachEvents;
}
export {};
