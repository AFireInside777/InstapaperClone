from flask import Flask, request, redirect, url_for, render_template, jsonify
from flask_caching import Cache
from datetime import datetime
import datetime
from flask_sqlalchemy import SQLAlchemy
import sqlite3
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE URI"] = 'sqlite:///test.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class User(db.Model):   
    picsrc = db.Column(db.String, primary_key=True, nullable=False)
    posttitle = db.Column(db.String, primary_key=True, nullable=False)
    date = db.Column(db.String, primary_key=True, nullable=False)
    link = db.Column(db.String, primary_key=True, nullable=False)
    art_clip = db.Column(db.String, primary_key=True, nullable=False)

    def __init__(self, thepic, thetitle, thedate, thelink, theart):
        self.picsrc = thepic
        self.posttitle = thetitle
        self.date = thedate
        self.link = thelink
        self.art_clip = theart

db.create_all()
db.session.commit()

@app.route('/')
def hello():
    return render_template('FlaskProject2.html')

@app.route('/collect', methods = ['GET'])
def dbretrieval():
    sendtoJS = []
    if bool(User.query.all()) == True:
        for post in User.query.all():
            notearray = []
            notearray.append(post.picsrc)
            notearray.append(post.posttitle)
            notearray.append(post.date)
            notearray.append(post.link)
            notearray.append(post.art_clip)
            sendtoJS.append(notearray)
        print(sendtoJS)
        return jsonify(sendtoJS)
    else:
        return jsonify("Nah bruh")

@app.route('/processlink', methods = ['POST'])
def dbentry():

    passedlink = request.get_json('passedlink')
    requestedsite = requests.get(passedlink)
    print(requestedsite)
    rsstatus = requestedsite.status_code
    print(rsstatus)
    sendtoJS = []
    notearray = []
    if rsstatus == 200:
        print("Good to go, ya dig?")
        linksoup = BeautifulSoup(requestedsite.text, 'html.parser')

        if bool(linksoup.find_all('img')) == True: 
            firstpic = linksoup.find_all('img')[0]
            if bool(firstpic["src"]) == True: #Getting errors on some sites with this line
                firstpic = firstpic["src"]
            elif bool(firstpic["srcset"]) == True:
                firstpic = firstpic["srcset"]
        else:
            firstpic = "/static/Could Not Find Pic.png"
                    
        title = linksoup.find_all('h1')#[0] make function for finding ('h2') as well, https://www.inc.com/geoffrey-james/the-correct-way-to-hang-toilet-paper-according-to-.html
        titletext = title[0].getText()# Also get h1 tags buried in other divs.    

        savedate = datetime.datetime.now()
        savedate2 = savedate.strftime("%x")

        if bool(linksoup.find_all("p")) == True:
            article = linksoup.find_all("p")[0].getText()
            art2 = article[0:100]
        else:
            art2 = "We couldn't find text for these idiots."

        postobject = User(firstpic, titletext, savedate2, passedlink, art2)
        
        db.session.add(postobject)
        db.session.commit()

        return jsonify("Done deal, chap.")

app.run(debug=True)