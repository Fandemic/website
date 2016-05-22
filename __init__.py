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
import os

app = Flask(__name__)
Mobility(app)
db = MongoClient('45.79.159.210', 27017).fandemic

#================INDEX=====================
@app.route('/')
def home():
    return render_template('index.html')
#-------------------------------------------

@app.route('/blog')
def blog():
    return render_template('blog/blog.html')
#-------------------------------------------

@app.route('/terms')
def terms():
    return render_template('terms.html')
#-------------------------------------------

@app.route('/faq')
def faq():
    return render_template('faq.html')
#-------------------------------------------

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')       

#=================MOCK STORES=====================
@app.route('/<starID>')
@mobile_template('{mobile/}shop.html')
def store(template,starID):

    star = db.stars.find_one({'id':starID.lower()}) #find the star
    print star

    if star == None: return render_template("404.html")

    #get the stars products
    if star['active']:
        products = star['products']
    else:
        products = db.sample_products.find({'category': star['category']}).sort("sort",-1).limit(30)

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

    #get the ajaxed info
    if request.method == "POST":

        info = request.get_json()

        if info['active'] == 'False':
            SECRET_KEY = 'sk_test_BSCdbwIufwN4xI0AKXBk3XNB'
            PUBLISHABLE_KEY = 'pk_test_z1mq9KQ3GyakW5OdduPIX94u'
        else:
            SECRET_KEY = 'sk_live_tcrVqjaEdr9Jue13huqL7lk2'
            PUBLISHABLE_KEY = 'pk_live_kyvM71oajfwVWnxBoy7SfqOp'

        #initialize the stripe data
        stripe_keys = {
            'secret_key': SECRET_KEY,
            'publishable_key': PUBLISHABLE_KEY
        }

        stripe.api_key = stripe_keys['secret_key']


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

        #build the string to be saved
        order = {}
        order['name'] = info['billing_name']
        order['email'] = info['email']
        order['address'] = {}
        order['address']['street1'] = info['shipping_address_line1']
        order['address']['city'] = info['shipping_address_city']
        order['address']['state'] = info['shipping_address_state']
        order['address']['zip'] = info['shipping_address_zip']
        order['address']['country'] = info['shipping_address_country']
        order['stripe'] = {}
        order['stripe']['id'] = charge['id']
        order['stripe']['customer'] = charge['customer']
        order['cart'] = info['cart']
        order['total'] = charge['amount']
        order['ip'] = info['client_ip']
        order['star_id'] = info['star_id']
        order['active'] = True if info['active'] == 'True' else False

        db.orders.insert_one(order)

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

#================CONTACT_FORM_MODAL==================
@app.route('/supportContactForm', methods=['GET', 'POST'])
def support():
    firstname = request.form['name']
    email = request.form['email']
    message = request.form['message']
    current_ip = request.environ['REMOTE_ADDR']

    toaddr = ['ethan@fandemic.co', 'brandon@fandemic.co']
    fromaddr = 'fandemicstore@gmail.com'

    msg = MIMEMultipart()
    msg['From'] = fromaddr
    msg['To'] = ", ".join(toaddr)
    msg['Subject'] = "Support Email"
    html = """
         <html>
           <head></head>
           <body>
             <p>
                 Firstname: """ + firstname + """<br>
                 Email: """ + email + """<br>
                 Message: """ + message + """<br>
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

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)
