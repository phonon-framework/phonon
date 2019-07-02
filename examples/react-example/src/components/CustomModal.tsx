import * as React from 'react';

// tslint:disable variable-name
const CustomModal: React.FunctionComponent = () => {
  return (
    <div className="modal" id="exampleTopModal" data-config="center: false" tabIndex={-1} role="modal">
    <div className="modal-inner" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Modal title</h5>
          <button type="button" className="icon-close" data-dismiss="modal" aria-label="Close">
            <span className="icon" aria-hidden="true"></span>
          </button>
        </div>
        <div className="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div className="modal-footer">
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CustomModal;

/*
 * You can also import the Modal component only instead of
 * importing the global phonon bundle in App.vue
 * See below example
 */
/*
import Modal from 'phonon/dist/js/components/modal';

export default class CustomModal extends React.Component<{}, {}> {
  private myRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this.setState({
      modal: new Modal({ el: this.myRef }),
    });
  }

  public render() {
    return (
      <div className="modal" ref={this.myRef} id="exampleTopModal" data-config="center: false" tabIndex={-1} role="modal">
        <div className="modal-inner" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button type="button" className="icon-close" data-dismiss="modal" aria-label="Close">
                <span className="icon" aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
*/
