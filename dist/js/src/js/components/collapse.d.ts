import Component from '../component';
interface IProps {
    element?: HTMLElement | string;
    toggle?: boolean;
}
export default class Collapse extends Component {
    static attachDOM(): void;
    constructor(props?: IProps);
    getHeight(): number;
    toggle(): boolean;
    show(): boolean;
    hide(): boolean;
    isVisible(): boolean;
}
export {};
