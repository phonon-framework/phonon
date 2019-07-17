import Modal, { IProps } from './modal';
interface IModalPromptProps extends IProps {
    inputValue?: string;
}
export default class ModalPrompt extends Modal {
    constructor(props: IModalPromptProps);
    show(): boolean;
    hide(): boolean;
    setInputValue(value?: string): void;
    getInputValue(): string;
    onElementEvent(event: Event): void;
    private getInput;
    private attachInputEvent;
    private detachInputEvent;
}
export {};
