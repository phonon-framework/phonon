import Component from '../component';
import { Color, Size } from '../mixins';
interface IProps {
    element?: HTMLElement | string;
    color?: Color;
    size?: Size;
}
export default class Loader extends Component {
    constructor(props?: IProps);
    show(): boolean;
    animate(startAnimation?: boolean): boolean;
    hide(): boolean;
    private getSpinner;
}
export {};
