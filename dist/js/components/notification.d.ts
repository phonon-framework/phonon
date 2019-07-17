import Component from '../component';
import { Color } from '../mixins';
interface IProps {
    element?: HTMLElement | null | string;
    title?: string;
    message?: string;
    button?: boolean;
    timeout?: null;
    background?: Color.primary;
    directionX?: 'right';
    directionY?: 'top';
    offsetX?: 0;
    offsetY?: 0;
    appendIn?: HTMLElement | string;
}
export default class Notification extends Component {
    static attachDOM(): void;
    private timeoutCallback;
    private elementGenerated;
    constructor(props?: IProps);
    build(): void;
    setPosition(): void;
    show(): boolean;
    hideBody(): void;
    hide(): boolean;
    onElementEvent(): void;
}
export {};
