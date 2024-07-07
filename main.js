// dark mode
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
document.addEventListener('DOMContentLoaded', () =>  {
    getRecipes();
});

let recipes = [];

const addSelectedIngredient = () => {
    const selectedIngredient = ingredients.find((ingredient) => ingredient.id == selectorIngredients.value);
    const tr = document.createElement("tr");
    tr.className = "tr-ingredients"
    tr.innerHTML = `
    <td>${selectedIngredient.name}</td>
    <td><input class="porcentage-ingredient form-control" type="number" name="porcentage-ingredient" required></td>
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

const showRecipes = () => {
    printRecipe.innerHTML='';
    recipes.forEach(recipe => {
        const div = document.createElement("div");
        div.className = "table-responsive";
        div.innerHTML = `
        <table class="table table-striped table-hover">
            <thead class="table-active">
                <tr>
                    <th>Nombre receta:</th>
                    <th colspan="4">${recipe.id}</th>
                </tr>
                <tr>
                    <th>Gramaje:</th>
                    <th colspan="4">${recipe.recipeGrams}</th>
                </tr>
                <tr>
                    <th>Unidades:</th>
                    <th colspan="4">${recipe.recipeUnits}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Id:</th>
                    <th>Ingredientes:</th>
                    <th>Porcentaje:</th>
                    <th>Peso de ingrediente:</th>
                    <th>Costo de ingrediente:</th>
                </tr>
                ${recipe.recipeIngredients.map(ingredient => `
                    <tr>
                        <td>${ingredient.id}</td>
                        <td>${ingredient.name}</td>
                        <td>${ingredient.porcentage}%</td>
                        <td>${recipe.totalRound.find(item => item.id === ingredient.id).PesoReceta}</td>
                        <td>$${recipe.totalPrice.find(item => item.id === ingredient.id).precioReceta.toFixed(1)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td><button class="btn btn-danger" id="${recipe.id}" >borrar receta</button></td>
                    <th colspan="2">Totales: </th>
                    <th>Peso de la receta: ${recipe.totalRound.reduce((acc, item) => acc + item.PesoReceta, 0)} gramos</th>
                    <th>Costo total: $${recipe.totalPrice.reduce((acc, item) => acc + item.precioReceta, 0).toFixed(2)}</th>
                </tr>

            </tfoot>
        </table>
        `;
        printRecipe.appendChild(div);
    });
}

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
    showRecipes();
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
        recipeIngredients.push({ id: ingredient.id, name: ingredient.name, porcentage: Number(porcentage), price: ingredient.price});
    });

    const totalPercentage = recipeIngredients.reduce((acc, item) => acc + item.porcentage, 0);
    console.log(totalPercentage);

    const totalRound = recipeIngredients.map((item) => {
        return {
            id: item.id,
            PesoReceta: Math.round((recipeGrams / totalPercentage) * (item.porcentage * recipeUnits)),
            price: item.price
        };
    });

    const totalPrice = totalRound.map((item)=> {
        return {
            id: item.id,
            precioReceta: (item.price * item.PesoReceta) / 1000
        }
    })

    totalRound.forEach((item,index) => {
        const tr = document.querySelectorAll('.tr-ingredients')[index];
        tr.querySelector('.ingredient-grams').innerText = item.PesoReceta;
    })

    totalPrice.forEach((item,index) => {
        const tr = document.querySelectorAll('.tr-ingredients')[index];
        tr.querySelector('.ingredient-price').innerText = item.precioReceta;
    })

    console.log(totalRound);

    const recipe = {...createRecipe(recipeName, Number(recipeGrams), Number(recipeUnits), recipeIngredients),totalRound, totalPrice};

    addRecipe(recipe);

    Toastify({
        text: "¡Receta creada exitosamente!",
        duration: 3000,
        position: "center",
        style: {
            background: "blue"
        }
    }).showToast();
    showRecipes()
});

// mostrar recetas de ejemplo

const containerRecipesExamples = document.getElementById('imprimir-recetas-random')
const btnShowRecipeExamples = document.getElementById('show-recipe-examples')

const printExamples = async () => {
    const response = await fetch("./randomRecipes.json");
    const randomRecipes = await response.json();
    containerRecipesExamples.innerHTML='';
    randomRecipes.forEach(recipe => {
        const div = document.createElement("div");
        div.className = "table-responsive";
        div.innerHTML = `
        <table class="table table-striped table-hover">
            <thead class="table-active">
                <tr>
                    <th>Nombre receta:</th>
                    <th colspan="4">${recipe.id}</th>
                </tr>
                <tr>
                    <th>Gramaje:</th>
                    <th colspan="4">${recipe.recipeGrams}</th>
                </tr>
                <tr>
                    <th>Unidades:</th>
                    <th colspan="4">${recipe.recipeUnits}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Id:</th>
                    <th>Ingredientes:</th>
                    <th>Porcentaje:</th>
                    <th>Peso de ingrediente:</th>
                    <th>Costo de ingrediente:</th>
                </tr>
                ${recipe.recipeIngredients.map(ingredient => `
                    <tr>
                        <td>${ingredient.id}</td>
                        <td>${ingredient.name}</td>
                        <td>${ingredient.porcentage}%</td>
                        <td>${recipe.totalRound.find(item => item.id === ingredient.id).PesoReceta}</td>
                        <td>$${recipe.totalPrice.find(item => item.id === ingredient.id).precioReceta.toFixed(1)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td><button class="btn btn-danger" id="${recipe.id}" >borrar receta</button></td>
                    <th colspan="2">Totales: </th>
                    <th>Peso de la receta: ${recipe.totalRound.reduce((acc, item) => acc + item.PesoReceta, 0)} gramos</th>
                    <th>Costo total: $${recipe.totalPrice.reduce((acc, item) => acc + item.precioReceta, 0).toFixed(2)}</th>
                </tr>

            </tfoot>
        </table>
        `;
        containerRecipesExamples.appendChild(div);
    });
};

btnShowRecipeExamples.addEventListener('click', () => {
    Toastify({
        text: "Los ejemplos de recetas, han sido añadidos, echa un ojo para inspirarte.😉",
        duration: 6000,
        position: "center",
        style: {
            background: "blue"
        }
    }).showToast();
    printExamples();
})

// mostrar recetario creado

const printRecipe = document.getElementById('imprimir-container');

const btnPrintRecipes = document.getElementById('print-recipes');


const deleteRecipe = (id) => {
    recipes.forEach((recipe, index) => {
        if (recipe.id === id) {
            recipes.splice(index, 1);
        }
    });
    saveRecipeStorage(recipes);
    showRecipes();
};

printRecipe.addEventListener('click', (e) => {
    deleteRecipe(e.target.id)
    Toastify({
        text: "¡Receta eliminada permanentemente!",
        duration: 3000,
        position: "center",
        style: {
            background: "red"
        }
    }).showToast();
});

