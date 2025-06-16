// ✅ CORRECT
export function renderGoogleSignInButton(onSuccess, onError) {
  if (!window.google) {
    console.error("Google API not loaded");
    return;
  }

  window.google.accounts.id.initialize({
    client_id : "23841402501-ubljdg95rfnfm2c2dirq4m8iujrd01bj.apps.googleusercontent.com", 
    callback: (response) => {
      if (response.credential) {
        onSuccess(response.credential);
      } else {
        onError(new Error("Google credential not found"));
      }
    },
  });

  window.google.accounts.id.renderButton(
    document.getElementById("google-signin-button"),
    { theme: "outline", size: "large", width: "100%" }
  );
}
