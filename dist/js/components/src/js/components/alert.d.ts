import Component from '../component';
interface IProps {
    element?: HTMLElement | string;
    fade?: boolean;
}
export default class Alert extends Component {
    static attachDOM(): void;
    private onTransition;
    constructor(props?: IProps);
    show(): boolean;
    hide(el?: HTMLElement): boolean;
    onElementEvent(event: Event): void;
    destroy(): void;
    private getOpacity;
}
export {};
