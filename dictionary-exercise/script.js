// https://gist.github.com/szemate/38288116e0eeef96bdc5f694d6de8e30

const apiEndpoint = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", event => {
    event.preventDefault();

    const wordInput = document.getElementById("wordInput");
    const definitionContainer = document.getElementById("definition");

    const word = wordInput.value.trim();

    // Don't send an unnecessary request if the input field is empty
    if (word === "") {
        return;
    }

    fetch(apiEndpoint + word)
        .then(response => {
            // The API returns 404 status code if no definition is found for
            // the word. This is expected behaviour, don't treat it as an error.
            if (response.status === 200 || response.status === 404) {
                return response.json();
            }
            throw `${response.status} ${response.statusText}`;
        })
        .then(data => {
            if (Array.isArray(data)) {
                // `data` is an array if definitions are found
                const firstDefinition = data[0].meanings[0].definitions[0];

                const definitionText = firstDefinition.definition;
                definitionContainer.innerHTML = "<p>" + definitionText + "</p>";

                const example = firstDefinition.example;
                if (example) {
                    definitionContainer.innerHTML +=
                        "<p><i>" + example + "</i></p>";
                }
            } else if (data.message) {
                // `data` is an object if no definition is found
                definitionContainer.innerText = data.message;
            } else {
                // `data` is in an unexpected format
                throw "Sorry, something went wrong";
            }
        })
        .catch(error => {
            definitionContainer.innerHTML =
                '<div class="alert alert-danger">' + error + "</div>";
        });
});
