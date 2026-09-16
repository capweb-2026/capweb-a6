import { validateMessage, replyTo } from "./brain.js";
import { persona } from "./persona.js";
import { renderMessages } from "./view.js";

const formulaire = document.querySelector("#chat-form");
const champ = document.querySelector("#message");
const liste = document.querySelector("#messages");
const accueil = document.querySelector("#accueil");
const suggestions = document.querySelector("#suggestions");
const statut = document.querySelector("#status");
const boutonEnvoyer = formulaire.querySelector('button[type="submit"]');
const boutonEffacer = document.querySelector("#effacer");
const boutonTheme = document.querySelector("#theme");
const boutonExporter = document.querySelector("#exporter");
const versionElt = document.querySelector("#version");
const historique = [];

let langue = "fr";
let capWebEcrit = false;

function afficherIdentite() {
	if (accueil) {
		accueil.textContent = persona.accueil;
	}
	if (suggestions) {
		const boutons = persona.suggestions.map((suggestion) => {
			const bouton = document.createElement("button");
			bouton.type = "button";
			bouton.textContent = suggestion;
			bouton.addEventListener("click", () => {
				champ.value = suggestion;
				champ.focus();
			});
			return bouton;
		});
		suggestions.replaceChildren(...boutons);
	}
	mettreAJourIdentite();
}

function mettreAJourIdentite() {
	const conversationVide = historique.length === 0;
	if (accueil) {
		accueil.hidden = !conversationVide;
	}
	if (suggestions) {
		suggestions.hidden = !conversationVide;
	}
}

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
		statut.textContent = "La conversation sauvegardee est abimee";
	}
}

formulaire.addEventListener("submit", async (event) => {
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
		mettreAJourIdentite();
		champ.value = "";
		statut.textContent = "";
		champ.focus();
		return;
	}

	const nombreMessages = historique.length;
	const prochaineLangue = resultat.value.toLowerCase() === "/lang en" ? "en" : langue;
	const historiqueAvantEnvoi = [...historique];
	historique.push({ role: "user", text: resultat.value });
	renderMessages(historique, liste);
	mettreAJourIdentite();
	enregistrer();

	capWebEcrit = true;
	boutonEnvoyer.disabled = true;
	statut.textContent = `${persona.nom} ecrit...`;

	try {
		const reponse = await demanderReponse(resultat.value, historiqueAvantEnvoi, nombreMessages, prochaineLangue);
		langue = prochaineLangue;
		historique.push({
			role: "assistant",
			text: reponse.texte
		});
		renderMessages(historique, liste);
		mettreAJourIdentite();
		enregistrer();

		champ.value = "";
		statut.textContent = reponse.source === "ia" ? "" : "mode degrade";
	} finally {
		boutonEnvoyer.disabled = false;
		capWebEcrit = false;
		champ.focus();
	}
});

boutonEffacer.addEventListener("click", () => {
	if (confirm("Effacer la conversation ?")) {
		historique.length = 0;
		localStorage.removeItem("capweb.historique");
		renderMessages(historique, liste);
		mettreAJourIdentite();
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
		.map((message) => `${message.role === "user" ? "Vous" : persona.nom} : ${message.text}`)
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

async function demanderReponse(message, historiqueAvantEnvoi, nombreMessages, prochaineLangue) {
	try {
		const reponse = await fetch("/api/chat", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ message, historique: historiqueAvantEnvoi })
		});
		if (!reponse.ok) {
			throw new Error("api chat indisponible");
		}

		const donnees = await reponse.json();
		if (typeof donnees.texte === "string" && typeof donnees.source === "string") {
			return donnees;
		}
		throw new Error("reponse api invalide");
	} catch {
		return {
			texte: replyTo(message, nombreMessages, prochaineLangue),
			source: "regles"
		};
	}
}

afficherIdentite();

fetch("/version.json", { headers: { accept: "application/json" } })
	.then((reponse) => (reponse.ok ? reponse.json() : null))
	.then((donnees) => {
		if (donnees && typeof donnees.version === "string" && versionElt) {
			versionElt.textContent = `version ${donnees.version}`;
		}
	})
	.catch(() => {});
