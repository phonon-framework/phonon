import Component from '../component';
interface IProps {
    element: HTMLElement | string;
}
export default class Tab extends Component {
    static attachDOM(): void;
    private tabSelector;
    private tabItemSelector;
    private tabContentSelector;
    private onAnimation;
    constructor(props: IProps);
    onElementEvent(event: Event): void;
    show(tabLink: HTMLElement): boolean;
    getTabEvent(tabLink: any): object;
    destroy(): void;
}
export {};
