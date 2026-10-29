import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../constant';
import type { GameInput } from '../types';
import { checkGameInput } from '../validation';
import { getElement } from './dom';

export function setupCreateForm(onSubmit: (game: GameInput) => Promise<void>) {
  const dialog = getElement<HTMLDialogElement>('#dialog');
  const form = getElement<HTMLFormElement>('#form');
  const errorText = getElement('#error');
  const submitButton = getElement<HTMLButtonElement>('#submit');

  const pakInput = getElement<HTMLInputElement>('#pak');
  const videoInput = getElement<HTMLInputElement>('#video');
  const titleInput = getElement<HTMLInputElement>('#title');
  const authorInput = getElement<HTMLInputElement>('#author');
  const descriptionInput = getElement<HTMLTextAreaElement>('#description');

  titleInput.maxLength = TITLE_MAX_LENGTH;
  descriptionInput.maxLength = DESCRIPTION_MAX_LENGTH;
  authorInput.maxLength = TITLE_MAX_LENGTH;

  function closeForm() {
    form.reset();
    errorText.textContent = '';
    dialog.close();
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    errorText.textContent = '';

    const pak = pakInput.files?.[0];
    const video = videoInput.files?.[0];
    if (!pak) {
      errorText.textContent = `You need to upload ${pakInput.accept}`;
      return;
    }
    if(!video){
      errorText.textContent = `You need to upload video`;
      return;
    }

    const game: GameInput = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      author: authorInput.value.trim(),
      pak,
      video,
    };

    const problem = checkGameInput(game);
    if (problem) {
      errorText.textContent = problem;
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Uploading game...';
    try {
      await onSubmit(game);
      closeForm();
    } catch (error) {
      errorText.textContent = 'Error: ' + (error as Error).message;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Publish';
    }
  }

  getElement('#create').addEventListener('click', () => dialog.showModal());
  getElement('#cancel').addEventListener('click', closeForm);
  form.addEventListener('submit', handleSubmit);
}