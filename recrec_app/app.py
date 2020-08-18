#################################################
# Import
#################################################
# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Routes
#################################################
# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/background")
def background():
    return render_template("background.html")

@app.route("/ingredients")
def ingredients():
    return render_template("ingredients.html")

#@app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon.ico'))

#################################################
# Finish
#################################################
if __name__ == "__main__":
    app.run()
