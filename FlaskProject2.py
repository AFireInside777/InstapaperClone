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

idcount = 0
array = False

class User(db.Model):   
    picsrc = db.Column(db.String, primary_key=True, nullable=False)
    posttitle = db.Column(db.String, primary_key=True, nullable=False)
    date = db.Column(db.String, primary_key=True, nullable=False)
    link = db.Column(db.String, primary_key=True, nullable=False)
    art_clip = db.Column(db.String, primary_key=True, nullable=False)
    notes = db.Column(db.String, nullable=True)
    id = db.Column(db.Integer, primary_key=True, nullable=False)

    def __init__(self, thepic, thetitle, thedate, thelink, theart, idcount):
        self.picsrc = thepic
        self.posttitle = thetitle
        self.date = thedate
        self.link = thelink
        self.art_clip = theart
        self.id = idcount
        
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
            notearray.append(post.id)
            notearray.append(post.notes)
            sendtoJS.append(notearray)
        return jsonify(sendtoJS)
    else:
        return jsonify("There's nothing here yet, bruv.")

@app.route('/processlink', methods = ['POST'])
def dbentry():

    global idcount
    passedlink = request.get_json('passedlink')
    requestedsite = requests.get(passedlink)
    rsstatus = requestedsite.status_code
    if rsstatus == 200:
        print("Good to go, ya dig?")
        linksoup = BeautifulSoup(requestedsite.text, 'html.parser')

        if bool(linksoup.find_all('img')) == True:
            imglist = linksoup.find_all('img')
            imgchoice = imglist[0]
            firstpic = imgchoice["src"]                      
        #elif bool(linksoup.find_all('img')) == True:
            #imglist = linksoup.find_all('img') #Getting errors on some sites with this line
            #firstpic = firstpic["src"]
            #elif bool(firstpic["srcset"]) == True:
                #firstpic = firstpic["srcset"]
        else:
            firstpic = "/static/Could Not Find Pic.png"     
        if bool(linksoup.find_all('title')) == True:
            title = linksoup.find_all('title')
            titletext = title[0].getText()
        else:
            title = linksoup.find_all('h1')#[0] make function for finding ('h2') as well, https://www.inc.com/geoffrey-james/the-correct-way-to-hang-toilet-paper-according-to-.html
            titletext = title[0].getText()# Also get h1 tags buried in other divs.    

        savedate = datetime.datetime.now()
        savedate2 = savedate.strftime("%x")

        if bool(linksoup.find_all("p")) == True:
            article = linksoup.find_all("p")[0].getText()
            art2 = article[0:100]
        else:
            art2 = "We couldn't find text for these idiots."

        postobject = User(firstpic, titletext, savedate2, passedlink, art2, idcount)
        
        db.session.add(postobject)
        db.session.commit()
        idcount += 1
        return jsonify("Done deal, chap.")
    else:
        return jsonify("They wouldn't allow us to take the info.")

@app.route('/updatenotes', methods = ['POST'])
def addnotes():

    notearrays = request.get_json('notetransferlist[]')
    for notearray in notearrays:
        entrynumber = int(notearray[0])
        print(entrynumber)
        notechangerecord = User.query.filter_by(id=entrynumber).first()
        notechangerecord.notes = notearray[1]
    db.session.commit()
    return jsonify("Notes were bloody updated, lad. Alrighty?")

app.run(debug=True)
