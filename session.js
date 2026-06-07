function saveUserSession(user) {
  localStorage.setItem("worldfg_user", JSON.stringify(user));
}

function getUserSession() {
  return JSON.parse(localStorage.getItem("worldfg_user"));
}

function clearSession() {
  localStorage.removeItem("worldfg_user");
}

// AUTO CHECK LOGIN
function requireAuth() {
  
  let user = getUserSession();
  
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  
  return user;
}