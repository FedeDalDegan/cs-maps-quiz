let QUESTIONS = []

// Traemos las preguntas desde un archivo externo
async function fetchQuestions(){
    try{
        const response = await fetch("../data/questionscs16.json") // Con await nos aseguramos de que la promesa sea resuelta antes de continuar
        if(!response.ok){
            throw new Error("Error HTTP.")
        }
        const data = await response.json() // Convertimos la respuesta del fetch a objeto JS. json() retorna una promesa
        QUESTIONS = data // Asigna el contenido del archivo JSON a la variable global QUESTIONS
        startQuiz() // Cuando las preguntas ya fueron recibidas y transformadas a objetos JS, iniciamos el quiz.
    }catch(e){
        console.error("No se pudieron cargar las preguntas: ", e)
        questionElement.innerHTML = "Error al cargar las preguntas."
    }
}

// Declaramos elementos del HTML
const questionElement = document.getElementById("question")
const answerButtons = document.getElementById("answer-buttons")
const nextButton = document.getElementById("next-btn")

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Siguiente";
    showQuestion();
}

// Mostramos las preguntas
function showQuestion(){
    resetState();
    let currentQuestion = QUESTIONS[currentQuestionIndex] // En base al indice (currentQuestionIndex) obtenemos una pregunta
    let questionNo = currentQuestionIndex + 1 // Vamos sumando el indice de las preguntas para recorrer todo el objeto
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question

    // Texto de las preguntas
    const questionText = document.createElement("p")
    questionText.innerHTML = questionNo + ". " + currentQuestion.question

    // imagen de las preguntas
    const img = document.createElement("img")
    img.src = currentQuestion.image
    img.alt = "Question Image"
    img.classList.add("question-image")
    questionElement.innerHTML = "" // Limpiamos texto previo
    questionElement.appendChild(questionText) // Insertamos la pregunta
    questionElement.appendChild(img) // Insertamos la imagen

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button")
        button.innerHTML = answer.text
        button.classList.add("btn")
        answerButtons.appendChild(button)
        if(answer.correct){
            button.dataset.correct = answer.correct
        }
        button.addEventListener("click", selectAnswer)
    });
}

// Antes de una nueva pregunta, reiniciamos el estado de la pregunta anterior
function resetState(){
    nextButton.style.display = "none" // Ocultamos el boton "next"
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild)
    }
}


function selectAnswer(e){
    const selectedBtn = e.target // Obtiene el boton seleccionado y se almacena en "selectedBtn"
    const isCorrect = selectedBtn.dataset.correct === "true"
    if(isCorrect){
        selectedBtn.classList.add("correct")
        score++;
    }else{
        selectedBtn.classList.add("incorrect")
    }

    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct") // Se agrega solo en caso de que el dataset sea true.
        }
        button.disabled = true // Una vez seleccionada una respuesta, bloqueamos los demas y solo permitimos que se clickee "next"
    })
    nextButton.style.display = "block" // Mostramos el boton Next
}

// Mostrar la puntuacion final
function showScore(){
    resetState()
    questionElement.innerHTML = `Acertaste ${score} de ${QUESTIONS.length}`
    nextButton.innerHTML = "Jugar de nuevo"
    nextButton.style.display = "block"
}

// Boton de SIGUIENTE
function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < QUESTIONS.length){
        showQuestion()
    }else{
        showScore()
    }
}

nextButton.addEventListener("click", () => {
    if(currentQuestionIndex < QUESTIONS.length){
        handleNextButton()
    }else{
        startQuiz()
    }
})

fetchQuestions()