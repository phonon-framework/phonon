import Component from '../component';
interface IProps {
    element: HTMLElement | string;
    name?: null;
    selectable?: boolean;
    filterItems?: () => boolean;
    multiple?: boolean;
    tag?: boolean;
}
interface ISelectboxItem {
    text: string;
    value: string;
    element: HTMLElement;
}
export default class Selectbox extends Component {
    static attachDOM(): void;
    private filterItemsHandler;
    private searchInputInContainer;
    constructor(props: IProps);
    getSearchInput(): HTMLInputElement | null;
    filterItems(search: string | undefined, item: ISelectboxItem): boolean;
    showItems(): void;
    getItems(): ISelectboxItem[];
    setSelected(value?: string, text?: string): boolean;
    getSelected(): string | string[];
    setSearchInputWidth(): void;
    getItemData(item?: HTMLElement | null): {
        text: string;
        value: string;
    };
    onElementEvent(event: KeyboardEvent): void;
    addItemSelection(value: string): void;
    removeLastSelected(): void;
    removeSelected(selectedItem: HTMLElement): void;
    showPlaceholder(show?: boolean): void;
    updateActiveList(): void;
    toggle(): boolean;
    show(): boolean;
    hide(): boolean;
}
export {};
