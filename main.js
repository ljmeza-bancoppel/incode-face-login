const tokenServerURL = import.meta.env.VITE_TOKEN_SERVER_URL
let onBoarding;

const mainContainer = document.getElementById("app");
const loginContainer = document.getElementById("login");
const loginButton = document.getElementById("login-button");


function showError(e = null) {
  mainContainer.innerHTML = "Something Went Wrong, see console for details...";
  console.log(e)
}

function identifyUser(identityId) {
  onBoarding.renderLogin(mainContainer, {
    onSuccess: async (response) => {
      const { token, transactionId, interviewToken, faceMatch, customerId, email } = response;
      if (faceMatch) {
        console.log("token:", token);
        console.log("transactionId:", transactionId);
        console.log("interviewToken:", interviewToken);
        console.log("faceMatch:", faceMatch);
        console.log("customerId:", customerId);
        console.log("email:", email);

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
        showError(new Error("Face did not match any user."));
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
}

function finish(customerId, email) {
  mainContainer.innerHTML = `Sucessfull Login:<br/>\n<div>CustomerId: ${customerId}</div>\n<div>Email: ${email}</div>`;
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
  loginButton.addEventListener('click', () => {
    const identityIdInput = document.getElementById("identity-id");
    loginContainer.style.display = "none";
    identifyUser(identityIdInput.value)
  })
}

document.addEventListener("DOMContentLoaded", app);
