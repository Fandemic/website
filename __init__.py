from flask import Flask, render_template, request, jsonify, redirect
from pymongo import MongoClient, GEO2D
from collections import Counter
from jinja2 import Template
import json
import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from flask.ext.mobility import Mobility
from flask.ext.mobility.decorators import mobile_template
import stripe

SECRET_KEY = 'sk_test_BSCdbwIufwN4xI0AKXBk3XNB'
PUBLISHABLE_KEY = 'pk_test_z1mq9KQ3GyakW5OdduPIX94u'

app = Flask(__name__)
Mobility(app)
db = MongoClient('localhost', 27017).fandemic

#================INDEX=====================
@app.route('/')
def home():
    return render_template('index.html')
#-------------------------------------------

#=================MOCK STORES=====================
@app.route('/<starID>')
@mobile_template('{mobile/}shop.html')
def store(template,starID):

    star = db.stars.find_one({'id':starID}) #find the star

    #get the stars products
    if star['active']:
        products = db.products.find({'star_id': star['id']})
    else:
        products = db.sample_products.find({'category': star['category']})

    #loop products and index the categories on the fly
    catIndex = {}
    productsFiltered = []
    counter = 1
    for p in products:
        p["subcatID"] = [] #list of ID's for each product
        for c in p["subcat"]:

            if c in catIndex:
                p["subcatID"].append(catIndex[c])

            else:
                catIndex[c] = counter
                counter += 1
                p["subcatID"].append(catIndex[c])

        productsFiltered.append(p)

    return render_template(template, star = star,products = productsFiltered, cat=catIndex)
#---------------------------------------------

#================PROCESS AN ORDER====================#
@app.route('/charge', methods=['GET', 'POST'])
def charge():

    #initialize the stripe data
    stripe_keys = {
        'secret_key': SECRET_KEY,
        'publishable_key': PUBLISHABLE_KEY
    }
    stripe.api_key = stripe_keys['secret_key']

    #get the ajaxed info
    if request.method == "POST":
        info = request.get_json()

        customer = stripe.Customer.create(
            email=info['email'],
            card=info['id']
        )

        charge = stripe.Charge.create(
            customer=customer.id,
            amount=info['amount'],
            currency='usd',
            description= info['billing_name'] + ' ordered products from ' + info['star'],
            receipt_email=info['email']
        )

        print info['cart']

    return '';

#================ACTIVATE_STORE_MODAL==================
@app.route('/activateStore', methods=['GET', 'POST'])
def activate():
    firstname = request.form['firstname']
    email = request.form['email']
    phone = request.form['phone']
    youtube = request.form['youtube']
    instagram = request.form['instagram']
    facebook = request.form['facebook']
    current_ip = request.environ['REMOTE_ADDR']

    toaddr = ['ethan@fandemic.co', 'brandon@fandemic.co']
    fromaddr = 'fandemicstore@gmail.com'

    msg = MIMEMultipart()
    msg['From'] = fromaddr
    msg['To'] = ", ".join(toaddr)
    msg['Subject'] = "New Store Activation Request"
    html = """
            <html>
              <head></head>
              <body>
                <p>
                    Firstname: """ + firstname + """<br>
                    Email: """ + email + """<br>
                    Phone: """ + phone + """<br>
                    Youtube: """ + youtube + """<br>
                    Instagram: """ + instagram + """<br>
                    Facebook: """ + facebook + """<br>
                    IP Address: """ + current_ip + """
                </p>
              </body>
            </html>
            """
    msg.attach(MIMEText(html, 'html'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(fromaddr, "Fandemic123")
    text = msg.as_string()
    server.sendmail(fromaddr, toaddr, text)
    server.quit()

    return ''
#----------------------------------------------

#================STATIC_PAGES==================
@app.route('/faq')
def faq():
    return render_template('faq.html')
#----------------------------------------------

if __name__ == '__main__':
    app.run(debug=True)
