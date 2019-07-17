import Component from '../component';
interface IProps {
    element?: HTMLElement | string;
    height?: number;
    min?: number;
    max?: number;
    now?: number;
    label?: boolean;
    striped?: boolean;
    animate?: boolean;
    background?: null | string;
}
export default class Progress extends Component {
    static attachDOM(): void;
    private onTransition;
    constructor(props: IProps);
    set(value?: number): boolean;
    animateProgressBar(startAnimation?: boolean): boolean;
    show(): boolean;
    hide(): boolean;
    destroy(): void;
    private setHeight;
    private setAccessibility;
    private setStriped;
    private setBackground;
    private getProgressBar;
}
export {};
