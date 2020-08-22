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
    redirect,
    make_response,
    g)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Basic Routes
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
    print('inside /ingredients route')
    return render_template("ingredients.html")

@app.route("/recipes")
def recipes():
    return render_template("recipes.html")

@app.route("/notebook")
def notebook():
    return redirect("https://nbviewer.jupyter.org/github/hchuhtala/Recipe-ML-App/blob/master/ML/Data%20Cleaning%20and%20Exploration.ipynb")

#@app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon.ico'))

#################################################
# Data Routes
#################################################
@app.route("/ingredients/<cuisine>")
def loadCuisine(cuisine):
    resp = make_response(render_template("ingredients.html"))
    resp.set_cookie('Cuisine', cuisine)
    print("In loadCuisine cookie is", request.cookies.get('Cuisine'))
    return resp


@app.route("/passCuisine")
def passCuisine():
    print('inside passCuisine route')
    #regionString = cuisine
     # POST request
    if request.method == 'POST':
        print('Incoming..')
        print(request.get_json())  # parse as JSON
        return 'OK', 200
    # GET request
    else:
        resp = request.cookies.get('Cuisine')
        return resp 

@app.route("/loadIngredients", methods = ['POST'])
def loadIngredients():
    array = request.get_data()
    resp = make_response()
    resp.set_cookie('Ingredients', array)
    print("In loadIngredients cookie is", request.cookies.get('Ingredients'))
    return resp

@app.route("/getIngredients")
def getIngredients():
    resp = request.cookies.get()
    return resp

#################################################
# Finish
#################################################
if __name__ == "__main__":
    app.run()
