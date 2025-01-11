import sys, io, traceback, os, contextlib, uuid, threading
from flask import Flask, render_template, request, jsonify
from queue import Queue

app = Flask(__name__)
executions = {}

class InputProvider:
  def __init__(self):
    print("initializing input provider")
    self.input_queue = Queue()
    self.output_buffer = io.StringIO()
  
  def get_input(self, prompt=""):
    print("getting input")
    self.output_buffer.write(prompt)
    raise InputRequired()

  def set_input(self, user_input):
    print("setting input")
    self.input_queue.put(user_input)
    return user_input
  
class InputRequired(Exception):
  pass

@app.route('/')
def editor():
  return render_template("index.html")

@app.route('/execute', methods=['POST'])
def execute():
  data = request.get_json()
  input_provider = InputProvider()
  if 'input' in data and data['input'] is not None:
    userinput = data['input']
    try:
      print("test")
      input_provider.set_input(userinput)
      return jsonify({'output': input_provider.output_buffer.getvalue(), 'waitingForInput': False})
    except InputRequired:
      return jsonify({'output': input_provider.output_buffer.getvalue(), 'waitingForInput': True})
    except Exception as e:
      print("Error executing code:", str(e))
      return jsonify({'output': None, 'error': str(e)})
    
  print("code received from fronend (input null)")
  
  code = data.get('code')
  old_stdout = sys.stdout
  redir_out = sys.stdout = io.StringIO()
  exec_env = {
    'input': input_provider.get_input,
    '__name__': '__main__'
  }
  print("executing input")
  try:
    print("test 2")
    exec(code, exec_env)
    output = input_provider.output_buffer.getvalue()
    print(output, code)
    return jsonify({'output': output, 'watingForInput': False})
  except InputRequired:
    return jsonify({'output': input_provider.output_buffer.getvalue(), 'waitingForInput': True})
  except Exception as e:
    error_msg = traceback.format_exc()
    return jsonify({'output': None, 'error': str(error_msg)})

if __name__ == "__main__":
  app.run(debug=True)
    
