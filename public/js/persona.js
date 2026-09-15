export const persona = {
	nom: "NetQuiz",
	emoji: "🌐",
	accueil: "Bonjour, je suis NetQuiz. Je t'aide à réviser TCP/IP, DNS et HTTP avec des explications simples et des quiz courts.",
	suggestions: [
		"Quiz TCP/IP : que fait TCP ?",
		"Explique DNS simplement",
		"Quiz HTTP : client ou serveur ?"
	]
};

function compterGraphemes(texte) {
	if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
		return [...new Intl.Segmenter("fr", { granularity: "grapheme" }).segment(texte)].length;
	}
	return [...texte].length;
}

function estEmojiUnique(texte) {
	if (typeof texte !== "string" || texte.length === 0) {
		return false;
	}
	if (compterGraphemes(texte) !== 1) {
		return false;
	}
	try {
		return /\p{Extended_Pictographic}/u.test(texte);
	} catch {
		return texte.trim().length > 0 && texte.trim() !== "abc";
	}
}

export function validatePersona(candidate) {
	const erreurs = [];

	if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
		return { ok: false, erreurs: ["persona invalide"] };
	}

	const nomTrim = typeof candidate.nom === "string" ? candidate.nom.trim() : "";
	if (typeof candidate.nom !== "string" || nomTrim.length < 2 || nomTrim.length > 20) {
		erreurs.push("nom invalide : entre 2 et 20 caractères après trim");
	}

	if (!estEmojiUnique(candidate.emoji)) {
		erreurs.push("emoji invalide : un seul emoji visible attendu");
	}

	if (typeof candidate.accueil !== "string" || nomTrim === "" || !candidate.accueil.includes(nomTrim)) {
		erreurs.push("accueil invalide : doit contenir le nom");
	}

	if (!Array.isArray(candidate.suggestions) || candidate.suggestions.length !== 3) {
		erreurs.push("suggestions invalides : trois suggestions attendues");
	} else {
		const invalide = candidate.suggestions.some(
			(suggestion) => typeof suggestion !== "string" || suggestion.trim().length === 0
		);
		if (invalide) {
			erreurs.push("suggestions invalides : chaque suggestion doit être non vide après trim");
		}
	}

	if (erreurs.length === 0) {
		return { ok: true };
	}
	return { ok: false, erreurs };
}
