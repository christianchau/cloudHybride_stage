from urllib import response
from flask import Flask, request, jsonify, flash, redirect, url_for, render_template
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
							   unset_jwt_cookies, jwt_required, JWTManager
from flask_cors import CORS
import psycopg2
import secrets
from dotenv import load_dotenv
import os
from argon2 import PasswordHasher

load_dotenv()
ph = PasswordHasher()

HOST = os.getenv('HOST')
DATABASE = os.getenv('DATABASE')
DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')

app = Flask(__name__)

# CORS implemented so that we don't get errors when trying to access the server from a different server location
CORS(app)

conn = psycopg2.connect(
        host=HOST,
        database=DATABASE,
        user=DATABASE_USERNAME,
        password=DATABASE_PASSWORD)
print(conn)
cursor = conn.cursor()

app.config["JWT_SECRET_KEY"] = secrets.token_hex(16)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=50)
jwt = JWTManager(app)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        print(get_jwt())
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/token', methods=["POST", "GET"])
def create_token_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    cursor.execute("SELECT email, password FROM beneficiaire WHERE email='{}'".format(email))
    User = cursor.fetchall()
    verify_password = ph.verify(User[0][1], password)
    """
    find_email = any(email in sublist for sublist in User)
    find_password = any(password in sublist for sublist in User)
    if find_email == True and find_password == True:
    """
    if email == User[0][0] and verify_password == True :
        access_token = create_access_token(identity=email)
        response = {"access_token":access_token}
        return response
    else:
        return {"msg": "Wrong email or password"}, 401

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/profile', methods=["GET"])
@jwt_required()
def my_profile():
    current_user = get_jwt_identity()
    cursor.execute("SELECT * FROM beneficiaire WHERE email='{}'".format(current_user))
    User = cursor.fetchall()
    print(User)
    response_body = {
        "firstname": User[0][3],
        "lastname" : User[0][4],
        "email": User[0][1],
        "dateofbirth": User[0][7],
        "civility": User[0][8],
        "number": User[0][6],
        "address": User[0][9],
        "city": User[0][10],
        "zipcode": User[0][5],                
        "credit": User[0][14]
    }
    return response_body


@app.route('/register', methods =["GET", "POST"])
def add_user():
        email = request.form.get('email')
        cursor.execute("SELECT email FROM beneficiaire WHERE email='{}'".format(email))
        Users = cursor.fetchall()
        find_email = any(email in sublist for sublist in Users)
        if find_email:
            return 'Email already used !'
        if request.method == 'POST':
            data = request.form.to_dict()
            hashed_password = ph.hash(data['password'])
            data['password'] = hashed_password
            print(data)
            cursor.execute("INSERT INTO beneficiaire (email, password, firstName, lastName, phoneNumber, dateOfBirth, civility, ZipCode, address, city) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(
                f"{data['email']}", f"{data['password']}", f"{data['firstname']}", f"{data['lastname']}",
                f"{data['phoneNumber']}", f"{data['dateOfBirth']}", f"{data['gender']}", f"{data['ZipCode']}", f"{data['address']}", f"{data['city']}"))
            conn.commit()
            return 'User registered' #redirect("", 301)
        else:
            return 'Failed to submission'



@app.route("/offre")
def offre():
    cursor.execute("SELECT * FROM offre")
    Offres = cursor.fetchall()
    print(Offres)
    """
    for i in range(len(Offres)):
        for j in range(len(Offres[i])):
            Offer = Offres[i][j]
            print(Offer)
    return 'hello'
    """
    response_body = {
        "name": Offres[0][1],
        "type" : Offres[0][2],
        "description": Offres[0][3],
        "datedebut": Offres[0][4],
        "duree": Offres[0][5],
        "address": Offres[0][8],
        "ville": Offres[0][9],          
        "prix": Offres[0][11]
    }
    return response_body

##### Fournisseur Part #####
@app.route('/register_f', methods =["GET", "POST"])
def add_fournisseur():
        email = request.form.get('email')
        cursor.execute("SELECT email FROM fournisseur WHERE email='{}'".format(email))
        Users = cursor.fetchall()
        find_email = any(email in sublist for sublist in Users)
        if find_email:
            return 'Email already used !'
        if request.method == 'POST':
            try:
                data = request.form.to_dict()
                hashed_password = ph.hash(data['password'])
                data['password'] = hashed_password
                print(data)
                cursor.execute("INSERT INTO fournisseur (email, password, name, phoneNumber, ZipCode, address, city, description, IBAN, SIREN) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(
                    f"{data['email']}", f"{data['password']}", f"{data['name']}", f"{data['phoneNumber']}", f"{data['ZipCode']}", f"{data['address']}", f"{data['city']}",
                    f"{data['description']}", f"{data['IBAN']}", f"{data['SIREN']}"))
                conn.commit()
            except (Exception, psycopg2.DatabaseError) as error:
                cursor.execute("ROLLBACK")
            return 'User registered'
        else:
            return 'Failed to submission'
            #return redirect(url_for('my_profile'))

@app.route('/token_f', methods=["POST", "GET"])
def create_token_fournisseur():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    cursor.execute("SELECT email, password FROM fournisseur WHERE email='{}'".format(email))
    User = cursor.fetchall()
    print(User)
    verify_password = ph.verify(User[0][1], password)
    if email == User[0][0] and verify_password == True :
        access_token = create_access_token(identity=email)
        response = {"access_token":access_token}
        return response
    else:
        return {"msg": "Wrong email or password"}, 401

@app.route('/profile_f', methods=["GET", "POST"])
@jwt_required()
def my_profile_f():
    current_user = get_jwt_identity()
    cursor.execute("SELECT * FROM fournisseur WHERE email='{}'".format(current_user))
    User = cursor.fetchall()
    print(User)
    response_body = {
        "name": User[0][3],
        "email": User[0][1],
        "number": User[0][4],
        "address": User[0][6],
        "city": User[0][7],
        "zipcode": User[0][5],  
        "description": User[0][8],              
        "IBAN": User[0][9],
        "SIREN": User[0][10],    
    }
    return response_body

@app.route('/add_offer', methods=["POST", "GET"])
def add_offer():
    if request.method =="POST":
        offer = request.form.to_dict()
        print(offer)
        cursor.execute("INSERT INTO offre (name, type, description, dateDebut, durée, address, city, creditNecessaire) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(
            f"{offer['name']}", f"{offer['type']}", f"{offer['description']}", f"{offer['dateDebut']}", f"{offer['durée']}",
            f"{offer['address']}", f"{offer['city']}", f"{offer['creditNecessaire']}"))
        conn.commit()
        return 'Adding offer ...'


@app.route('/delete_offer', methods=['GET', 'POST'])
def delete_offer():
    return

@app.route('/modify_offer', methods=['GET', 'POST'])
def modify_offer():
    return


if __name__ == "__main__":
    app.run(debug=True)