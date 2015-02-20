var togglePanel = document.querySelector('.toggle-panel');
togglePanel.addEventListener('click', function(evt) {
	evt.preventDefault();
	Phonon.Panel('#myPanelexample').toggle();
});