// tableau des tags
const tags = [
  { value: "+💰", name: "Crédit" },
  { value: "🛒", name: "courses" },
  { value: "🍕", name: "Snack" },
  { value: "🥐", name: "Boulangerie" },
  { value: "🐈", name: "Vétérinaire" },
  { value: "🍹", name: "Sortie" },
  { value: "🏠", name: "Loyer" },
  { value: "📡", name: "Internet" },
  { value: "💡", name: "Électricité" },
  { value: "🏍", name: "Assurance" },
];
// Générer un identifiant unique basé sur le temps
const id = Date.now();
// liste des transactions récupérées depuis le localStorage (ou tableau vide)
let transactions = JSON.parse(localStorage.getItem("transactions")) || []; 
let total = transactions.reduce((sum, t) => sum +t.amount.toFixed(2)); // Recalcul du total

//! Charger et/ou mettre à jour la liste des transactions
function loadTransactions() {
   const transactionsList = document.getElementById('transactions-list');
   transactionsList.innerHTML = '';

   // Pour chaque transaction créée, on génère un item de liste.
   // On lui donne une classe CSS (className) et un contenu (innerHTML)
   transactions.forEach(transaction => {
      const li = document.createElement('li');
      li.className= 'transaction';
      const date = new Date(transaction.date).toLocaleDateString("fr-FR"); // Format lisible

      li.innerHTML = `
         <span class="transaction-date">${date}</span>
         <span class="myTag">${transaction.description}</span>
         <span class="${transaction.amount < 0 ? "negative" : "positive"}">
            ${transaction.amount.toFixed(2)} €
         </span>
      `;
      // Ici on ajoute le contenu créé au DOM
      transactionsList.appendChild(li);
   });
   toggleResetButton();
}

//! Mettre à jour l'affichage du total
function updateTotal() {
   // contenu de la div dont l'id = total
   document.getElementById('total').textContent = parseFloat(total.toFixed(2) + ' €');
   toggleResetButton();
}

//! Gestion de la modale avec les fonctions d'ouverture et de fermeture
function openModal() {
   document.getElementById("transactionModal").style.display = "flex";
}
function closeModal() {
   document.getElementById("transactionModal").style.display = "none";
}

//! Afficher le bouton reset
function toggleResetButton() {
  const resetButton = document.getElementById("reset-transactions");
  if (transactions.length > 0) { // si la longueur de la liste est suppérieure à zéro
    resetButton.style.display = "block";
  } else {
    resetButton.style.display = "none";
  }
}

//! Attacher les événements après chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
   // Gestion de l'ouverture / fermeture de la modale
   document.getElementById("add-amount").addEventListener("click", openModal);
   document.getElementById("close-modal").addEventListener("click", closeModal);
   
   //* Gestion de la sélection des tags
   const tagSelect = document.getElementById("tag");
   tags.forEach(tag => {
      const option = document.createElement("option");
      option.value = tag.value;
      option.textContent = `${tag.value} ${tag.name}`;
      tagSelect.appendChild(option)
   })

   //* Gestion du formulaire d'ajout d'une transaction
   document.getElementById("transactionForm").addEventListener('submit', (e) => {
      e.preventDefault();

      const description = document.getElementById("description").value;
      const amountInput = document.getElementById("amount").value.replace(",", ".");
      const amount = parseFloat(amountInput);
      const tag = document.getElementById("tag").value;

      // S'il n'y a pas de description ou s'il n'y a pas de somme on retourne rien
      if (!description || isNaN(amount)) return;

      // Date au format ISO
      const date = new Date().toISOString();

      // Logique de calcul et mise à jour dde la liste des transactions
      total += amount;
      transactions.push({
         id,
         description: `${tag} ${description}`,
         amount,
         date // ajout de la date
      });

      // Sauvegarde dans le localStorage
      localStorage.setItem("transactions", JSON.stringify(transactions));

      // Mise à jour des différents affichages
      updateTotal();
      loadTransactions();
      toggleResetButton(); //! Dernier ajout
      closeModal();
      e.target.reset();
   });

   //* Réinitialisation des transactions
   document
     .getElementById("reset-transactions")
     .addEventListener("click", () => {
       transactions = []; // Vide le tableau
       total = 0; // Remet le total à 0
       localStorage.removeItem("transactions"); // Supprime les transactions du localStorage

       updateTotal(); // Met à jour le total affiché
       loadTransactions(); // Recharge la liste vide
       toggleResetButton(); // Vérifie s'il faut afficher ou cacher le bouton
     });

   //* Initialisation
   loadTransactions();
   updateTotal();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("Service Worker enregistré !"))
    .catch((err) => console.error("Service Worker non enregistré", err));
}