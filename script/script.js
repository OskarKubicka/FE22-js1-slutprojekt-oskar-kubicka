const divDisplayImages = document.querySelector('#div-images');

const searchButton = document.querySelector('#search-button');
const text = document.querySelector('#text');
const number = document.querySelector('#number');
const sort = document.querySelector('#sorting');
const radioButtons = document.querySelectorAll('input[name="size"]');
const errorElement = document.createElement('h1');
const hideFormBtn = document.createElement('button');
const showFormBtn = document.createElement('button');
const hideFormDiv = document.querySelector('#hide-form-buttons-div');
const form = document.querySelector('form');
const loadAnimation = document.querySelector('#load-animation');

hideFormDiv.appendChild(hideFormBtn);
hideFormDiv.appendChild(showFormBtn);
hideFormBtn.innerText = "Dölj sökfält";
showFormBtn.style.display = "none";
hideFormBtn.setAttribute("id", "hide-button");
showFormBtn.setAttribute("id", "show-button");
//nedan click funktioner styr huruvida formuläret ska visas eller ej
$(hideFormBtn).click(function () {
    $(form).slideUp(700, function () {
        showFormBtn.style.display = "block";
        showFormBtn.innerText = "Visa sökfält";
        hideFormBtn.style.display = "none";
        
    });
});
$(showFormBtn).click(function () {
    $(form).slideDown(700, function () {
        hideFormBtn.style.display = "block";
        hideFormBtn.innerText = "Dölj sökfält";
        showFormBtn.style.display = "none";
    });
});


//klickfunktion för att söka bilder 
searchButton.addEventListener('click', function (event) {
    //nedan rad tar bort tidigare sökte bilder
    divDisplayImages.innerHTML = '';
    event.preventDefault();
    let selectedSize;
    for (const radioButton of radioButtons) {

        if (radioButton.checked) {

            selectedSize = radioButton.value;
            break;
        }
    }
    if (text.value == "") {
        alert('Du måste skriva i söktext');
        
    }
    else if (number.value < 1) {
        alert('Du måste fylla i antal bilder');
    }

    else if (radioButtons[0].checked == false && radioButtons[1].checked == false && radioButtons[2].checked == false) {
        //error om ingen storlek valts
        alert('Du måste välja bildstorlek');
        divDisplayImages.style.visibility = "hidden";

    }
    //om alla fält är korrekt ifyllda går det vidare med ladd-animation och fetch mm.
    else {

        const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=c3a31fcef72f3cef640d059908f23598&text=${text.value}&sort=${sort.value}&per_page=${number.value}&format=json&nojsoncallback=1`;
        divDisplayImages.style.visibility = "visible";
        //muspekarens laddanimation
        document.body.style.cursor = 'wait';
        searchButton.style.cursor = 'wait';
        function input() {
            //ladd animation

            loadAnimation.style.visibility = "visible";
            loadAnimation.style.animation = "up-to-down 1.5s ease-in-out forwards infinite alternate";

            fetch(url).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                else {
                    throw 'Problem har uppstått. Vänligen prova igen!';
                }
            }).then(function (data) {

                for (let i = 0; i < data.photos.photo.length; i++) {
                    document.body.style.cursor = 'default';
                    searchButton.style.cursor = 'default';
                    const img = document.createElement('img');
                    img.src = `https://live.staticflickr.com/${data.photos.photo[i].server}/${data.photos.photo[i].id}_${data.photos.photo[i].secret}_${selectedSize}.jpg`;
                    divDisplayImages.appendChild(img);
                    //function för att öppna bild i originalstorlek i nytt fönster
                    img.addEventListener('click', function () {
                        
                        window.open(`https://live.staticflickr.com/${data.photos.photo[i].server}/${data.photos.photo[i].id}_${data.photos.photo[i].secret}_${selectedSize}.jpg`, "_blank", "toolbar=yes, fullscreen=yes");
                    });


                }
                //om det inte kommer upp någon html så blir det error
                loadAnimation.style.visibility = "hidden";
                loadAnimation.style.animation = "";

                if (divDisplayImages.innerHTML == '') {
                    document.body.style.cursor = 'default';
                    searchButton.style.cursor = 'default';
                    divDisplayImages.append(errorElement);
                    errorElement.innerText = 'Bilder går ej att hitta, var god sök på nytt!';
                }
            }).catch(function (error) {
                console.log(error);
                divDisplayImages.append(errorElement);
                errorElement.innerHTML = `Något har gått snett, prova igen och om problemet kvarstår vänligen ladda om sidan`;
                loadAnimation.style.visibility = "hidden";
                loadAnimation.style.animation = "";
            })
        }
        input();
    }


})
