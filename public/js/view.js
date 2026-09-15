import { persona } from "./persona.js";

export function renderMessages(messages, container) {
	const lignes = messages.map((msg) => {
		const li = document.createElement("li");
		const etiquette = msg.role === "user" ? "Vous" : persona.nom;
		li.dataset.role = msg.role;
		li.append(`${etiquette} : `, ...renderText(msg.text));
		return li;
	});

	container.replaceChildren(...lignes);
}

function renderText(text) {
	const morceaux = [];
	const motif = /\*\*([^*]+)\*\*/g;
	let position = 0;
	let resultat = motif.exec(text);

	while (resultat) {
		morceaux.push(text.slice(position, resultat.index));
		const strong = document.createElement("strong");
		strong.textContent = resultat[1];
		morceaux.push(strong);
		position = resultat.index + resultat[0].length;
		resultat = motif.exec(text);
	}

	morceaux.push(text.slice(position));
	return morceaux;
}
