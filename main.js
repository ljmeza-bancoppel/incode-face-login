const tokenServerURL = import.meta.env.VITE_TOKEN_SERVER_URL
let onBoarding;

const mainContainer = document.getElementById("app");
const loginContainer = document.getElementById("login");
const loginButton = document.getElementById("login-button");


function showError(e = null) {
  mainContainer.innerHTML = "Algo ha salido mal, ver consola para más detalles...";
  console.log(e)
}

function identifyUser(identityId) {
  // NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
  try {
    onBoarding.renderLogin(mainContainer, {
      onSuccess: async (response) => {
        const { token, transactionId, interviewToken, faceMatch, customerId, email } = response;
        console.log("response:", response);
        alert(`faceMatch: ${faceMatch}`);
        if (faceMatch) {
          console.log("token:", token);
          console.log("transactionId:", transactionId);
          console.log("interviewToken:", interviewToken);
          console.log("faceMatch:", faceMatch);
          console.log("customerId:", customerId);
          console.log("email:", email);

          setTimeout(() => {
            finish(customerId, email, token, transactionId, interviewToken, faceMatch);
            console.log("Waited for 1 seconds");
          }, 1000);

          // User has an Incode Identity.
          // Verify using your backend that the faceMatch was actually valid and
          // not man in the middle attack
          /**
          const response = await fetch(`${tokenServerURL}/auth`,
            {
              method: "POST",
              mode: "cors",
              body: JSON.stringify({ token, transactionId: transactionId, interviewToken })
            }
          );
          const verification = await response.json();
          if (verification.verified === true) {
            finish(customerId, email);
          } else {
            showError(new Error("FaceMatch is invalid."));
          } */
        } else {
          setTimeout(() => {
            showError(new Error("Face did not match any user."));
            console.log("Waited for 1 seconds");
          }, 1000);
        }
      },
      onError: error => {
        showError(error)
        // User not found. Add rejection your logic here
      },
      isOneToOne: true,
      oneToOneProps: {
        identityId: identityId,
      }
    });
  } catch (error) {
    alert('Error!!');
    console.error(error);
  }
}

function finish(customerId, email, token, transactionId, interviewToken, faceMatch) {
  let message = `<div id="result"><p>Sucessfull Login:</p>\n`;
  message += `<div><p>CustomerId: ${customerId}</p></div>\n`
  message += `<div><p>Email: ${email}</p></div>\n`;
  // message += `<div>token: ${token}</p></div>\n`;
  message += `<div>transactionId: ${transactionId}</p></div>\n`;
  // message += `<div>interviewToken: ${interviewToken}</p></div>\n`;
  message += `<div>faceMatch: ${faceMatch}</div></div>`;
  mainContainer.innerHTML = message;
}

async function app() {
  // Create the instance of incode linked to a client
  const apiURL = import.meta.env.VITE_API_URL;
  // Enable for 1:N
  // const clientId = import.meta.env.VITE_CLIENT_ID;
  const apiKey = atob(import.meta.env.VITE_API_KEY);

  onBoarding = window.OnBoarding.create({
    apiURL,
    // clientId, // Enable for 1:N
    apiKey // Enable for 1:N
  });

  // Incode web_sdk need to preload some core component before being usable
  mainContainer.innerHTML = "Warming up...";
  await onBoarding.warmup();

  // Empty the message and starting the flow
  mainContainer.innerHTML = "";
  loginContainer.style.display = "flex";
  loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    const identityIdInput = document.getElementById("identity-id");
    if (required(identityIdInput)) {
      loginContainer.style.display = "none";
      identifyUser(identityIdInput.value.trim())
    }
  })
}

// If the length of the element's string is 0 then display helper message 
function required(inputtx) {
  if (inputtx.value.trim().length == 0) {
    alert("Completa el campo");
    return false;
  }
  return true;
}


document.addEventListener("DOMContentLoaded", app);
