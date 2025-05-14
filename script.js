const form = document.getElementById("operation-form");
const titre = document.getElementById("titre");
const montant = document.getElementById("montant");
const categorie = document.getElementById("categorie");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const titreValue = titre.value;
    const montantValue = montant.value;
    const categorieValue = categorie.value;
    const editId = form.getAttribute("data-edit-id");

    let operations = JSON.parse(localStorage.getItem("operations")) || [];

    if (editId) {

        operations = operations.map(op =>
            op.id == editId
                ? { ...op, titre: titreValue, montant: parseFloat(montantValue), categorie: categorieValue }
                : op
        );
        form.removeAttribute("data-edit-id");
    } else {
        
        operations.push({
            id: Date.now().toString(),
            titre: titreValue,
            montant: parseFloat(montantValue),
            categorie: categorieValue
        });
    }

    localStorage.setItem("operations", JSON.stringify(operations));
    form.reset();
    afficherOperations();
});
function afficherTotal (operations) {
    const total = operations.reduce((acc, operation) => acc + operation.montant, 0);
    const totalElement = document.getElementById("total-montant");
    totalElement.textContent = `Total: ${total}`;

}

const categories = ["loisirs", "quotidien", "alimentation", "sante"];

function remplirSelectCategories() {

    const selectCategorie = document.getElementById("categorie");
    selectCategorie.innerHTML = '<option value=""> Choisir une catégorie </option>';
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        selectCategorie.appendChild(option);
    });

    const selectFiltre = document.getElementById("filtre-categorie");
    selectFiltre.innerHTML = '<option value="">Toutes</option>';
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        selectFiltre.appendChild(option);
    });
}


function afficherTotal(operations) {
    const total = operations.reduce((acc, operation) => acc + operation.montant, 0);
    document.getElementById("total-montant").textContent = total.toFixed(2);
}

function filtrerOperations() {
    const operations = JSON.parse(localStorage.getItem("operations")) || [];
    const filtreCategorie = document.getElementById("filtre-categorie").value;

    const operationsFiltrees = operations.filter(operation => {
        return filtreCategorie === "" || operation.categorie === filtreCategorie;
    });

    afficherOperations(operationsFiltrees);
}

function filtreCategorie() {
    const selectFiltre = document.getElementById("filtre-categorie");
    selectFiltre.addEventListener("change", function() {
        filtrerOperations();
    });
}


filtreCategorie();


document.addEventListener("DOMContentLoaded", function() {
    remplirSelectCategories();
    afficherOperations();
});

function afficherOperations(operationsParam) {
    const operations =  operationsParam ||JSON.parse(localStorage.getItem("operations")) || [];
    const operationsTableBody = document.querySelector("#operations-table tbody");
    operationsTableBody.innerHTML = "";

    operations.forEach((operation, index) => {
        const tr = document.createElement("tr");

        const tdTitre = document.createElement("td");
        tdTitre.textContent = operation.titre;
        tr.appendChild(tdTitre);

        const tdMontant = document.createElement("td");
        tdMontant.textContent = operation.montant.toFixed(2) + " €";
        tr.appendChild(tdMontant);

        const tdCategorie = document.createElement("td");
        tdCategorie.textContent = operation.categorie;
        tr.appendChild(tdCategorie);

        const tdActions = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Modifier";
        editButton.addEventListener("click", function() {
        titre.value = operation.titre;
        montant.value = operation.montant;
        categorie.value = operation.categorie;
        form.setAttribute("data-edit-id", operation.id);
    });
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Supprimer";
        deleteButton.addEventListener("click", function() {
            operations.splice(index, 1);
            localStorage.setItem("operations", JSON.stringify(operations));
            afficherOperations();
        });
        tdActions.appendChild(editButton);
        tdActions.appendChild(deleteButton);
        tr.appendChild(tdActions);

        operationsTableBody.appendChild(tr);
    });
    afficherTotal(operations);
}

