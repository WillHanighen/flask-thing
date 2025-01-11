var editor = ace.edit("editor")
editor.setReadOnly(true);
editor.setOptions({fontSize: "14px"})
editor.setTheme("ace/theme/monokai")
editor.session.setMode("ace/mode/python")

function executeCode() {
    const code = editor.getValue()
    const output = document.getElementById("output")
    waitForInput = false

    fetch("/execute", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({code: code, input: null})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.waitingForInput)
        if(data.error) {
            output.style.color = "red"
            output.textContent = data.error
        }
        else if(data.waitingForInput) {
          console.log("displaying input message")
          waitForInput = true
          output.style.color = "#E4E4E4"
          output.textContent += data.output
          document.getElementById("user-input").focus()
        }
        else {
            console.log('test2', data)
            output.style.color = "#E4E4E4"
            output.textContent = data.output
        }
    })
    .catch(error => {
        output.style.color = "red"
        output.textContent = "An error has occured! error: " + error
    })
}

function submitInput() {
  if (!waitForInput) {
    return;
  }
  const userInput = document.getElementById("user-input").value
  const output = document.getElementById("output")
  // output.textContent += "\n" + userInput + "\n"
  fetch("/execute", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({input: userInput})
  })
  .then(response => response.json())
  .then(data => {
    console.log("display output")
    if (data.error) {
      output.style.color = "red"
      output.textContent += data.error
    }
    else if (data.waitingForInput) {
      output.style.color = "#E4E4E4"
      output.textContent += data.output
      waitForInput = true
      document.getElementById("user-input").focus()
    }
    else {
      console.log("display output from input field")
      console.log(data.output)
      output.style.color = "#E4E4E4"
      output.textContent += data.output
      waitForInput = false
    }
  })
  .catch(error => {
    output.style.color = "red"
    output.textContent += "An error has occurred! error: " + error
  })
}

document.getElementById("user-input").addEventListener("keypress", function(event) {
  if (event.key === 'Enter') {
    submitInput()
  }
})
