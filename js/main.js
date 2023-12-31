//  Сделать переход карточек по кнопкам 
// Проверка на ввод данных 
// Получение ответа с карточки


// Объект с сохраненными ответами
let answers = {
    2: null,
    3: null,
    4: null,
    5: null,
}

// Движение вперед
let btnNext = document.querySelectorAll("[data-nav='next']");
btnNext.forEach( function(item){
    item.addEventListener('click', function(){ 
        let thisCard = this.closest('[data-card]')
        let thisCardNumber = parseInt(thisCard.dataset.card)

        if (thisCard.dataset.validate == 'novalidate'){
            navigate('next', thisCard)
            updateProgressBar('next', thisCardNumber)
        }else {
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber))
            
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate('next', thisCard);
                updateProgressBar('next', thisCardNumber)
            } else {
                alert('Сделайте ответ, прежде чем переходить далее.');
            }

        }
    })
})

// Движение назад
let btnPrev = document.querySelectorAll("[data-nav='prev']");
btnPrev.forEach( function(item){
    item.addEventListener('click', function(){ 
        let thisCard = this.closest('[data-card]')
        let thisCardNumber = parseInt(thisCard.dataset.card)

        navigate('prev', thisCard)
        updateProgressBar('prev', thisCardNumber)
    })
})

// Функция для навигации вперед и назад
function navigate(direction, thisCard) {
    let thisCardNumber = parseInt(thisCard.dataset.card)
    let nextCard

    if (direction == 'prev') {
        nextCard = thisCardNumber - 1 
    }else if (direction == 'next') {
        nextCard = thisCardNumber + 1 
    }   

    thisCard.classList.add('hidden')
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden')
}

// Функция сбора заполненных данных с карточки
function gatherCardData(number) {
    let question
    let result = []

    let currentCard = document.querySelector(`[data-card="${number}"]`)

    question = currentCard.querySelector("[data-question]").innerText 

    let radioBtn = currentCard.querySelectorAll("[type='radio']")
    radioBtn.forEach( function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value:item.value 
            })  
        }
    })

    let checkboxBtn = currentCard.querySelectorAll("[type='checkbox']")
    checkboxBtn.forEach( function(item){
        if (item.checked) {
            result.push({
                name: item.name,
                value:item.value 
            })  
        }
    })
    
    let inputBtn = currentCard.querySelectorAll("[type='text'], [type='email'], [type='number']")
    inputBtn.forEach( function(item){
        itemValue = item.value
        if (itemValue.trim() != '') {
            result.push({
                name: item.name,
                value:item.value 
            })
        }
    })

    console.log(result);

    let data = {
        question: question,
        answer: result,
    }

    return data
}

// Ф-я записи ответа в объект с ответами
function saveAnswer(number, data) {
    answers[number] = data
}

// Ф-я проверки на заполненность
function isFilled(number){
    if (answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Ф-я для проверки email
function validateEmail(email) {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Проверка на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number){
    let currentCard = document.querySelector(`[data-card="${number}"]`)
    let requiredFields = currentCard.querySelectorAll('[required]')

    let isValidArray = [] 

    requiredFields.forEach( function(item){
        if (item.type == 'checkbox' && item.checked == false){
            isValidArray.push(false)
        }else if (item.type == 'email') {
            if(validateEmail(item.value)){
                isValidArray.push(true) 
            }else {
                isValidArray.push(false) 
            }
        }
    })

    if (isValidArray.indexOf(false) == -1) {
        return true
    }else {
        return false 
    }
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll('.radio-group').forEach( function(item) {
    item.addEventListener('click', function(e) {
        let label = e.target.closest('label')

        if (label) { 
            label.closest('.radio-group').querySelectorAll('label').forEach( function(item){
                item.classList.remove('radio-block--active')
            })
        }

        label.classList.add('radio-block--active')
    })
})

// Подсвечиваем рамку у чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach( function(item){
    item.addEventListener('change', function(){
        if (item.checked) {
            item.closest('label').classList.add('checkbox-block--active')
        }else {
            item.closest('label').classList.remove('checkbox-block--active')
        }
    })
})

// Отображение прогресс бара
function updateProgressBar(direction, cardNumber){
    let cardsTotalNumber = document.querySelectorAll('[data-card]').length
    if (direction == 'next') {
        cardNumber = cardNumber + 1
    }else if (direction == 'prev'){
        cardNumber = cardNumber - 1
    }

    let progress = (cardNumber * 100) / cardsTotalNumber
    progress = progress.toFixed()

    let currentCard = document.querySelector(`[data-card="${cardNumber}"]`)
    

    let progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector('.progress')
    if (progressBar) {
        progressBar.querySelector('.progress__label strong').innerText = `${progress}%`
        progressBar.querySelector('.progress__line-bar').style = `width: ${progress}%`
    }
    
}