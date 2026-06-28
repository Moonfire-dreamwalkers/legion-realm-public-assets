(function () {"use strict";
var AUTH_API = "/api/auth";
var authState = { loaded: false, user: null };
window.authState = authState;
function injectAuthButton() {var nav = document.querySelector("#primaryNav");if (!nav) {setTimeout(injectAuthButton, 200);return;}
if (document.querySelector("#authButton")) return;
var wrapper = document.createElement("span");wrapper.id = "authButton";wrapper.className = "auth-button-wrapper";
var link = document.createElement("a");link.className = "auth-link";link.href = "#";link.id = "authLink";
wrapper.appendChild(link);nav.appendChild(wrapper);
link.addEventListener("click", handleAuthClick);
renderAuthButton();}
function handleAuthClick(e) {e.preventDefault();
if (authState.user) {window.location.href = AUTH_API + "/logout";} else {window.location.href = AUTH_API + "/login";}}
var DISCORD_ICON_SVG = '<svg class="auth-discord-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/></svg>';
function renderAuthButton() {var link = document.getElementById("authLink");if (!link) return;
while (link.firstChild) {link.removeChild(link.firstChild);}
if (authState.user) {
if (authState.user.avatarUrl) {var img = document.createElement("img");img.src = authState.user.avatarUrl;img.alt = "";img.className = "auth-avatar";img.width = 24;img.height = 24;link.appendChild(img);}
var nameSpan = document.createElement("span");nameSpan.className = "auth-username";nameSpan.textContent = authState.user.username;link.appendChild(nameSpan);
link.title = "Click to log out";link.setAttribute("aria-label", "Logged in as " + authState.user.username + ". Click to log out.");link.classList.add("is-authenticated");link.classList.remove("is-unauthenticated");} else {
var iconSpan = document.createElement("span");iconSpan.innerHTML = DISCORD_ICON_SVG;link.appendChild(iconSpan);
var labelSpan = document.createElement("span");labelSpan.className = "auth-login-label";labelSpan.textContent = "Sign in";link.appendChild(labelSpan);
link.title = "Sign in with Discord";link.setAttribute("aria-label", "Sign in with Discord");link.classList.add("is-unauthenticated");link.classList.remove("is-authenticated");}}
function checkSession() {fetch(AUTH_API + "/me", { credentials: "same-origin" }).then(function (res) {if (!res.ok) throw new Error("Session check returned " + res.status);return res.json();}).then(function (data) {if (data.authenticated && data.user) {authState.user = data.user;authState.loaded = true;} else {authState.user = null;authState.loaded = true;}renderAuthButton();document.dispatchEvent(new CustomEvent("lr-auth-resolved", { detail: authState }));}).catch(function (err) {console.warn("[auth] Session check failed:", err.message);authState.user = null;authState.loaded = true;renderAuthButton();document.dispatchEvent(new CustomEvent("lr-auth-resolved", { detail: authState }));});}
function checkAuthError() {var params = new URLSearchParams(location.search);var error = params.get("auth_error");if (error) {console.warn("[auth] OAuth error from callback:", error);var url = new URL(location.href);url.searchParams.delete("auth_error");history.replaceState(null, "", url.toString());}}
function init() {if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", function () {injectAuthButton();checkSession();checkAuthError();});} else {injectAuthButton();checkSession();checkAuthError();}}
init();})();