import { validateMessage, replyTo } from "./brain.js";
import { renderMessages } from "./view.js";

const formulaire = document.querySelector("#chat-form");
const champ = document.querySelector("#message");
const liste = document.querySelector("#messages");
const statut = document.querySelector("#status");
const boutonEnvoyer = formulaire.querySelector('button[type="submit"]');
const boutonEffacer = document.querySelector("#effacer");
const boutonTheme = document.querySelector("#theme");
const boutonExporter = document.querySelector("#exporter");
const versionElt = document.querySelector("#version");
const historique = [];

let langue = "fr";
let capWebEcrit = false;

const themeSauvegarde = localStorage.getItem("capweb.theme");
if (themeSauvegarde === "dark" || themeSauvegarde === "light") {
	document.body.dataset.theme = themeSauvegarde;
}

const sauvegarde = localStorage.getItem("capweb.historique");
if (sauvegarde) {
	try {
		const messages = JSON.parse(sauvegarde);
		if (!Array.isArray(messages)) {
			throw new Error("Historique invalide");
		}
		historique.push(...messages);
		renderMessages(historique, liste);
	} catch {
		statut.textContent = "La conversation sauvegardée est abîmée";
	}
}

formulaire.addEventListener("submit", (event) => {
	event.preventDefault();

	if (capWebEcrit) {
		return;
	}

	const resultat = validateMessage(champ.value);
	if (!resultat.ok) {
		statut.textContent = resultat.error;
		champ.focus();
		return;
	}

	if (resultat.value.toLowerCase() === "/effacer") {
		historique.length = 0;
		localStorage.removeItem("capweb.historique");
		renderMessages(historique, liste);
		champ.value = "";
		statut.textContent = "";
		champ.focus();
		return;
	}

	const nombreMessages = historique.length;
	const prochaineLangue = resultat.value.toLowerCase() === "/lang en" ? "en" : langue;
	historique.push({ role: "user", text: resultat.value });
	renderMessages(historique, liste);
	enregistrer();

	capWebEcrit = true;
	boutonEnvoyer.disabled = true;
	statut.textContent = "Cap Web écrit…";

	setTimeout(() => {
		langue = prochaineLangue;
		historique.push({
			role: "assistant",
			text: replyTo(resultat.value, nombreMessages, langue)
		});
		renderMessages(historique, liste);
		enregistrer();

		champ.value = "";
		statut.textContent = "";
		boutonEnvoyer.disabled = false;
		capWebEcrit = false;
		champ.focus();
	}, 1000);
});

boutonEffacer.addEventListener("click", () => {
	if (confirm("Effacer la conversation ?")) {
		historique.length = 0;
		localStorage.removeItem("capweb.historique");
		renderMessages(historique, liste);
	}
});

boutonTheme.addEventListener("click", () => {
	const themeActuel = document.body.dataset.theme;
	const theme = themeActuel === "dark" ? "light" : "dark";
	document.body.dataset.theme = theme;
	localStorage.setItem("capweb.theme", theme);
});

boutonExporter.addEventListener("click", () => {
	const contenu = historique
		.map((message) => `${message.role === "user" ? "Vous" : "Cap Web"} : ${message.text}`)
		.join("\n");
	const blob = new window.Blob([contenu], { type: "text/plain;charset=utf-8" });
	const url = window.URL.createObjectURL(blob);
	const lien = document.createElement("a");
	lien.href = url;
	lien.download = "conversation-cap-web.txt";
	lien.click();
	window.URL.revokeObjectURL(url);
});

function enregistrer() {
	localStorage.setItem("capweb.historique", JSON.stringify(historique));
}

// Version du serveur local, échec discret si indisponible.
fetch("/version.json", { headers: { accept: "application/json" } })
	.then((reponse) => (reponse.ok ? reponse.json() : null))
	.then((donnees) => {
		if (donnees && typeof donnees.version === "string" && versionElt) {
			versionElt.textContent = `version ${donnees.version}`;
		}
	})
	.catch(() => {});
