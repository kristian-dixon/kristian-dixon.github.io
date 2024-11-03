// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};
document.querySelector('model-viewer').addEventListener('progress', onProgress);

window.addEventListener('message', function(event){
  let origin = event.origin; 
  console.log("origin: " + origin);

  if(typeof event.data == 'object' && event.data.call=='sendValue')
  {
    console.log(event.data.value);
    let model = document.getElementById("model");
    model["src"] = event.data.value;
  }
  
}, false);