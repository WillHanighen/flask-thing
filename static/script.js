var editor = ace.edit("editor")
editor.setTheme("ace/theme/monokai")
editor.session.setMode("ace/mode/python")

function executeCode() {
    const code = editor.getValue()
    const output = document.getElementById("output")
    
    fetch("/execute", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({code: code})
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            output.style.color = "red"
            output.textContent = data.error
        }
        else {
            output.style.color = "#E4E4E4"
            output.textContent = data.output
        }
    })
    .catch(error => {
        output.style.color = "red"
        output.textContent = "An error has occured: " + error
    })
}
