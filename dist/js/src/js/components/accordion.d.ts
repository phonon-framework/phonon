import Component from '../component';
import Collapse from '../components/collapse';
interface IProps {
    element?: HTMLElement | string;
    multiple?: boolean;
}
export default class Accordion extends Component {
    static attachDOM(): void;
    private collapses;
    constructor(props: IProps);
    addCollapse(element: any): Collapse;
    getCollapse(element: any): Collapse;
    getCollapses(): Collapse[];
    setCollapses(showCollapse: any): void;
    onElementEvent(event: Event): void;
    toggleIcon(collapse: HTMLElement, remove: string, add: string): void;
    show(collapseEl: string | HTMLElement): boolean;
    hide(collapseEl: any): boolean;
}
export {};
