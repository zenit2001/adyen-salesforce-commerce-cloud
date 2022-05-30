document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#settingsForm');
  const submitButton = document.querySelector('#settingsFormSubmitButton');
  // add event for save button availability on form change.
  form.addEventListener('change', () => {
    submitButton.classList.remove('disabled');
    submitButton.classList.add('enabled');
  });

  // add event to submit button to send form and present results
  submitButton.addEventListener('click', () => {
    const formData = new FormData(form);
    const requestBody = {};
    for (const formPair of formData.entries()) {
      requestBody[formPair[0]] = formPair[1];
    }

    fetch('AdyenSettings-Save', {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'POST',
      body: JSON.stringify(requestBody),
    }).then((response) => {
      console.log(response);
    });

    // $.ajax({
    //   type: 'POST',
    //   url: 'AdyenSettings-Save',
    //   data: JSON.stringify({ formData }),
    //   contentType: 'application/json; charset=utf-8',
    //   async: false,
    //   success(data) {
    //     console.log(data);
    //   },
    // });
  });
});
