window.onload = () => {
  localStorage.removeItem("token");
}
const urlBase = "http://localhost:8000";
const modalLogin = document.getElementById("modalLogin");
const bsModalLogin = new bootstrap.Modal(
  modalLogin,
  (backdrop = "static")
); // Pode passar opções
const modalRegistar = document.getElementById("modalRegistar");
const bsModalRegistar = new bootstrap.Modal(
  modalRegistar,
  (backdrop = "static")
); // Pode passar opções
const modalInfo = document.getElementById("modalInfo");
const bsModalInfo = new bootstrap.Modal(
  modalInfo,
  (backdrop = "static")
);

const btnModalLogin = document.getElementById("btnModalLogin");
const btnModalRegistar = document.getElementById("btnModalRegistar");
const btnModalAdviseLogin = document.getElementById("btnModalAdviseLogin")
const btnModalAdviseRegister = document.getElementById("btnModalAdviseRegister")
const btnLogoff = document.getElementById("btnLogoff");
const btnWebsite = document.getElementById("websiteButton");

btnModalAdviseLogin.addEventListener("click", () => {
  bsModalInfo.hide();
  bsModalLogin.show();
});

btnModalAdviseRegister.addEventListener("click", () => {
  bsModalInfo.hide();
  bsModalRegistar.show();
});

modalLogin.addEventListener("shown.bs.modal", () => {
  document.getElementById("usernameLogin").focus();
});
btnModalLogin.addEventListener("click", () => {
  bsModalLogin.show();
});
btnModalRegistar.addEventListener("click", () => {
  bsModalRegistar.show();
});
function tradeModal(){
    bsModalLogin.hide();
    bsModalRegistar.show();
};

btnLogoff.addEventListener("click", () => {
  localStorage.removeItem("token");
  btnModalLogin.style.display = "block";
  btnModalRegistar.style.display = "block";
  btnLogoff.style.display = "none";
  btnWebsite.classList.add("disabled");
  btnWebsite.disabled = true;
  window.location.replace("index.html");
  $(document).ready(function(){
    $('#websiteButton').tooltip({title: "Only for registered users!", placement: "bottom", delay: 0});
  });
});

function validaRegisto() {
  let email = document.getElementById("usernameRegistar").value; // email é validado pelo próprio browser
  let senha = document.getElementById("senhaRegistar").value; // tem de ter uma senha
  const statReg = document.getElementById("statusRegistar");
  if (senha.length < 4) {
    document.getElementById("passErroLogin").innerHTML =
      "A senha tem de ter ao menos 4 carateres";
    return;
  }
  fetch(`${urlBase}/registar`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: `email=${email}&password=${senha}`,
  })
    .then(async (response) => {
      if (!response.ok) {
        erro = response.statusText;
        statReg.innerHTML = response.statusText;
        throw new Error(erro);
      }
      result = await response.json();
      console.log(result.message);
      statReg.innerHTML = result.message;
    })
    .catch((error) => {
      document.getElementById(
        "statusRegistar"
      ).innerHTML = `Pedido falhado: ${error}`;
    });
}

function validaLogin() {
  let email = document.getElementById("usernameLogin").value; // email é validado pelo próprio browser
  let senha = document.getElementById("senhaLogin").value; // tem de ter uma senha
  if (senha.length < 4) {
    document.getElementById("passErroLogin").innerHTML =
      "A senha tem de ter ao menos 4 carateres";
    return;
  }
  const statLogin = document.getElementById("statusLogin");

  fetch(`${urlBase}/login`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `email=${email}&password=${senha}`,
  })
    .then(async (response) => {
      if (!response.ok) {
        erro = await(response.json())
        throw new Error(erro.msg);
      }
      result = await response.json();
      console.log(result.accessToken);
      const token = result.accessToken;
      localStorage.setItem("token", token);
      document.getElementById("statusLogin").innerHTML = "Sucesso!";
      document.getElementById("btnLoginClose").click();
      btnModalLogin.style.display = "none";
      btnModalRegistar.style.display = "none";
      document.getElementById("btnLogoff").style.display = "block";
      btnWebsite.classList.remove("disabled");
      btnWebsite.disabled = false;
      $(document).ready(function(){
        $("#websiteButton").tooltip('destroy');
      });
    })
    .catch(async (error) => {
      statLogin.innerHTML = error
    });
}



  