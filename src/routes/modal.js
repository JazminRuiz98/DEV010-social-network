function showModal(modal) {
  modal.style.display = 'block';
}

function closeModal(modal) {
  modal.style.display = 'none';
}

function createModal(message) {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalMessage = document.createElement('p');
  modalMessage.textContent = message;

  // const errorCodeElement = document.createElement('p');
  // errorCodeElement.textContent = `Código de error: ${errorCode}`;

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.textContent = 'X';
  closeButton.addEventListener('click', () => {
    closeModal(modal);
  });

  modalContent.appendChild(modalMessage);
  // modalContent.appendChild(errorCodeElement);
  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  return modal;
}

export { createModal, showModal, closeModal };
