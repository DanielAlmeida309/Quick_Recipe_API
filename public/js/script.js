const buttons = document.querySelectorAll("[data-section-button]");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const nextSection = document.querySelector("#"+button.dataset.sectionButton); 
    const nextButton = button;
    const actualSection = document.querySelector("[data-active-s]");
    const actualButton = document.querySelector("[data-active-b]");
    


    //retirar o data-active da section atual
    delete actualSection.dataset.activeS;

    //retirar o data-active do botão atual
    delete actualButton.dataset.activeB;

    //colocar o data-active na nova section 
    nextSection.dataset.activeS = true;

    //colocar o data-active no novo botão
    nextButton.dataset.activeB = true;

  })
});

