// funciones crear ingredientes
let ingredients = [];
const ingredientForm = document.getElementById('ingredient-form');
const ingredientList = document.getElementById('ingredients');
const ingredientsTotalAdded = document.getElementById('ingredients-total');
const selectorIngredients = document.getElementById('selector-ingredientes');
const porcentageIngredient = document.getElementById('porcentage-ingredient');
const btnAddSelectedIngredient = document.getElementById('add-selected-ingredient');
const ingredientsRecipe = document.getElementById('ingredients-recipe');
const recipeForm = document.getElementById('recipeForm')
const btnCreateRecipe = document.getElementById('create-recipe')


const createIngredient = (ingredientId, ingredientType, ingredientName, ingredientPrice) => {
    return {
        id: ingredientId,
        type: ingredientType,
        name: ingredientName,
        price: Number(ingredientPrice)
    };
};

const getRandomId = () => {
    return Math.floor(Math.random() * Date.now()).toString(8);
};

const addIngredient = (ingredient) => {
    const tr = document.createElement("tr");
    ingredients.push(ingredient);

    tr.innerHTML = `
        <td>${ingredient.id}</td>
        <td>${ingredient.type}</td>
        <td>${ingredient.name}</td>
        <td>${ingredient.price}</td>
        <td><button class="btn btn-danger" id="${ingredient.id}" >delete</button></td>
    `;
    ingredientList.appendChild(tr);

    const option = document.createElement('option');
    option.value = ingredient.id
    option.textContent = ingredient.name

    selectorIngredients.appendChild(option);

    ingredientForm.reset();
    saveIngredientsStorage(ingredients);
    ingredientsTotalAdded.innerHTML = `<strong>: ${ingredients.length}</strong>`;
};

const deleteIngredient = (id) => {
    ingredients.forEach((ingredient, index) => {
        if (ingredient.id === id) {
            ingredients.splice(index, 1);
        }
    });
    showIngredients(ingredients);
    saveIngredientsStorage(ingredients);
};

const showIngredients = (ingredients) => {
    ingredientList.innerHTML = '';
    ingredients.forEach(ingredient => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${ingredient.id}</td>
            <td>${ingredient.type}</td>
            <td>${ingredient.name}</td>
            <td>${ingredient.price}</td>
            <td><button class="btn btn-danger" id="${ingredient.id}" >delete</button></td>
        `;
        ingredientList.appendChild(tr);
        const option = document.createElement('option');
        option.value = ingredient.id
        option.textContent = ingredient.name
        selectorIngredients.appendChild(option);
    });
    ingredientsTotalAdded.innerHTML = `<strong>: ${ingredients.length}</strong>`;
};


const saveIngredientsStorage = (ingredients) => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients))
};

const getIngredientsStorage = () => {
    const ingredientsStorage = JSON.parse(localStorage.getItem('ingredients'));
    return ingredientsStorage;
};

const getIngredients = () => {
    if (localStorage.getItem('ingredients')) {
        ingredients = getIngredientsStorage();
        showIngredients(ingredients);
    };
};

// Listeners crear ingredientes
document.addEventListener('DOMContentLoaded', () =>  {
    getIngredients();
});

ingredientForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData(ingredientForm);
    const ingredientId = getRandomId();
    const ingredientType = form.get('form-select');
    const ingredientName = form.get('ingredient-name');
    const ingredientPrice = form.get('ingredient-price');

    const ingredient = createIngredient(ingredientId, ingredientType, ingredientName, Number(ingredientPrice));

    addIngredient(ingredient);
    Toastify({
        text: "¡Ingrediente Agregado!",
        duration: 3000,
        position: "center",
        style: {
            background: "green"
        }
    }
    ).showToast();
});

ingredientList.addEventListener('click', (e) => {
    deleteIngredient(e.target.id)
    Toastify({
        text: "¡Ingrediente eliminado permanentemente!",
        duration: 3000,
        position: "center",
        style: {
            background: "red"
        }
    }
    ).showToast();
});


//funciones crear recetas

let recipes = [];

const addSelectedIngredient = () => {
    const selectedIngredient = ingredients.find((ingredient) => ingredient.id == selectorIngredients.value);
    const tr = document.createElement("tr");
    tr.className = "tr-ingredients"
    tr.innerHTML = `
    <td>${selectedIngredient.name}</td>
    <td><input class="porcentage-ingredient" type="number" name="porcentage-ingredient" required></td>
    <td class="ingredient-grams">0</td>
    <td class="ingredient-price">${selectedIngredient.price}</td>
    <td><button class="btn btn-danger delete-added-ingredient">-</button></td>
    `;
    tr.querySelector('.delete-added-ingredient').addEventListener('click', () => {
        tr.remove();
    });
    ingredientsRecipe.appendChild(tr)
    console.log(tr)
};
// listener add ingredients
btnAddSelectedIngredient.addEventListener('click', () => {
    addSelectedIngredient()
    Toastify({
        text: "Ingrediente agregado de tu lista. Ahora, agrega sus porcentajes.",
        duration: 5000,
        position: "center",
        style: {
            background: "green"
        }
    }).showToast()
});

const createRecipe = (recipeName, recipeGrams, recipeUnits, recipeIngredients) => {
    return {
        id: recipeName,
        recipeGrams: recipeGrams,
        recipeUnits: recipeUnits,
        recipeIngredients: recipeIngredients
    }
};

const addRecipe = (recipe) => {
    recipes.push(recipe);
    saveRecipeStorage(recipes);
};

const saveRecipeStorage = (recipes) => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
};

const getRecipeStorage = () => {
    const recipeStorage = JSON.parse(localStorage.getItem('recipes'));
    return recipeStorage;
};

const getRecipes = () => {
    if (localStorage.getItem('recipes')) {
        recipes = getRecipeStorage();
    }
};

// listener crear receta
btnCreateRecipe.addEventListener('click', (e) => {
    e.preventDefault();
    const form = new FormData(recipeForm);
    const recipeName = form.get('name-recipe');
    const recipeGrams = form.get('grams-recipe');
    const recipeUnits = form.get('units-recipe');
    let recipeIngredients = [];

    document.querySelectorAll('.tr-ingredients').forEach((tr) => {
        const ingredientName = tr.querySelector('td:first-child').innerText;
        const ingredient = ingredients.find(ing => ing.name === ingredientName);
        const porcentage = tr.querySelector('.porcentage-ingredient').value;
        recipeIngredients.push({ id: ingredient.id, porcentage: Number(porcentage) });
    });

    const totalPercentage = recipeIngredients.reduce((acc, item) => acc + item.porcentage, 0);
    console.log(totalPercentage);

    const totalRound = recipeIngredients.map((item) => {
        return {
            id: item.id,
            PesoReceta: Math.round((recipeGrams / totalPercentage) * (item.porcentage * recipeUnits))
        };
    });

    totalRound.forEach((item, index) => {
        const tr = document.querySelectorAll('.tr-ingredients')[index];
        if (tr) {
            tr.querySelector('.ingredient-grams').innerText = item.PesoReceta;
            const ingredient = ingredients.find(ing => ing.id === item.id);
            if (ingredient) {
                tr.querySelector('.ingredient-price').innerText = Number(((ingredient.price * item.PesoReceta) / 1000).toFixed(2));
            }
        }
    });

    console.log(totalRound);

    const recipe = {...createRecipe(recipeName, Number(recipeGrams), Number(recipeUnits), recipeIngredients),totalRound};

    addRecipe(recipe);

    const option = document.createElement('option');
        option.value = recipe.id
        option.textContent = recipe.id
        selectorRecipes.appendChild(option);

    Toastify({
        text: "¡Receta creada exitosamente!",
        duration: 3000,
        position: "center",
        style: {
            background: "blue"
        }
    }).showToast();
});

// imprimir receta en construccion...
const printRecipe = document.getElementById('imprimir-container');
const selectorRecipes = document.getElementById('selector-recipe');

// const printRecipes = () => {
//     recipes.forEach((item, index) => {
//         const selectedRecipe = recipes.find((recipe) => recipe.id == selector.value);
//         const div = document.createElement('div')
//     })
// };
