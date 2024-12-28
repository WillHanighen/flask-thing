import sys, io, traceback, os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def editor():
    return render_template("index.html")

@app.route('/execute')
def execute():
    pass

if __name__ == "__main__":
    app.run(debug=True)
    
