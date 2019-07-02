import React from 'react';

/**
 * Phonon bundle will detect elements created by the virtual DOM
 * If you prefer to use components, please include the component in specific files
 * See components/CustomModal.tsx for more information
 */
import 'phonon/dist/js/phonon';

import CustomModal from './components/CustomModal';

import './App.css';
import 'phonon/dist/css/phonon.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <button className="btn btn-primary" data-toggle="modal" data-target="#exampleTopModal">Launch modal</button>

      <CustomModal />
    </div>
  );
}

export default App;
