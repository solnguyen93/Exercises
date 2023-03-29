const meme = document.querySelector('#meme-generated');
const userInputImg = document.querySelector('input[id="meme-img-form"]');
const userInputTopP = document.querySelector('input[id="top-text-form"]');
const userInputBottomP = document.querySelector('input[id="bottom-text-form"]');
// Listener for submit
addEventListener('submit', (event) => {
  event.preventDefault();
  if (!userInputImg.value) {
    alert('Please link an image.');
    return;
  }
  // New meme, div class='meme' (container)
  const newDiv = document.createElement('div');
  newDiv.classList.add('meme');
  meme.append(newDiv);
  // Remove button
  const removeBtn = document.createElement('button');
  newDiv.append(removeBtn);
  // Listener on the button to remove button and meme
  removeBtn.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
      e.target.parentNode.remove();
    }
  });
  // Image
  const newImg = document.createElement('img');
  newImg.src = userInputImg.value;
  newDiv.append(newImg);
  userInputImg.value = '';
  // Top text
  const topP = document.createElement('p');
  topP.innerText = userInputTopP.value;
  newDiv.append(topP);
  userInputTopP.value = '';
  // Bottom text
  const bottomP = document.createElement('p');
  bottomP.innerText = userInputBottomP.value;
  newDiv.append(bottomP);
  userInputBottomP.value = '';
});
