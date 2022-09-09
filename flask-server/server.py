from errno import errorcode
from flask import Flask, request, jsonify,redirect, render_template, abort, flash
from urllib import response
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
							   unset_jwt_cookies, jwt_required, JWTManager
from flask_cors import CORS
import psycopg2
import secrets
from dotenv import load_dotenv
import os
from argon2 import PasswordHasher
import paramiko
from sshtunnel import SSHTunnelForwarder
from sqlalchemy.orm import sessionmaker #Run pip install sqlalchemy
from sqlalchemy import create_engine

load_dotenv()
HOST = os.getenv('POSTGRESQL_ADDON_HOST')
DATABASE = os.getenv('POSTGRESQL_ADDON_DB')
DATABASE_USERNAME = os.getenv('POSTGRESQL_ADDON_USER')
DATABASE_PASSWORD = os.getenv('POSTGRESQL_ADDON_PASSWORD')
PORT = os.getenv('POSTGRESQL_ADDON_PORT')

HOST_AWS = os.getenv('HOST_AWS')
DATABASE_AWS = os.getenv('DATABASE_AWS')
DATABASE_USERNAME_AWS = os.getenv('DATABASE_USERNAME_AWS')
DATABASE_PASSWORD_AWS = os.getenv('DATABASE_PASSWORD_AWS')
PORT_AWS = os.getenv('PORT_AWS')

app = Flask(__name__, static_folder='../client/build', static_url_path='/', template_folder='../client/build')

# CORS implemented so that we don't get errors when trying to access the server from a different server location
CORS(app)
ph = PasswordHasher()

"""key = paramiko.RSAKey.from_private_key_file("chau_key.pem")
with SSHTunnelForwarder(
                ('15.236.248.127', 22),
                ssh_username='ubuntu',
                ssh_pkey=key,
                remote_bind_address=(HOST_AWS, 5432),
                local_bind_address=("127.0.0.1",)
            ) as server:
                
                server.start()
                print ('Server connected via SSH')

                #connect to PostgreSQL
                local_port = str(server.local_bind_port)
                engine = create_engine('postgresql://postgres:AWSRDSPG123@127.0.0.1:' + local_port +'/postgres')

                Session = sessionmaker(bind=engine)
                session = Session()
                
                print ('Database session created')
                print(session)
                Offres = session.execute("SELECT * FROM offre")
                for row in Offres:
                    print(row)"""

conn = psycopg2.connect(
        host=HOST,
        database=DATABASE,
        user=DATABASE_USERNAME,
        password=DATABASE_PASSWORD,
        port=PORT,)
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

@app.route("/")
def index():
    return render_template("index.html")
    """return app.send_static_file('index.html')"""

@app.route('/token', methods=["POST", "GET"])
def create_token_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    cursor.execute("SELECT email, password FROM beneficiaire WHERE email='{}'".format(email))
    User = cursor.fetchall()
    print(User)
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
            return abort(401, description="Email already used !")
            """redirect("Email already used ! Click here to return home !", '/'), 401 """
            """return 'Email already used !'"""
        if request.method == 'POST':
            data = request.form.to_dict()
            hashed_password = ph.hash(data['password'])
            data['password'] = hashed_password
            print(data)
            cursor.execute("INSERT INTO beneficiaire (email, password, firstName, lastName, phoneNumber, dateOfBirth, civility, ZipCode, address, city) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(
                f"{data['email']}", f"{data['password']}", f"{data['firstname']}", f"{data['lastname']}",
                f"{data['phoneNumber']}", f"{data['dateOfBirth']}", f"{data['gender']}", f"{data['ZipCode']}", f"{data['address']}", f"{data['city']}"))
            conn.commit()
            return redirect('/'), 301
        else:
            return abort(401, description="Failed to submit !")

@app.route("/offre")
def offre():
    #Connect to EC2 AWS with port forwarding
    key = paramiko.RSAKey.from_private_key_file("chau_key.pem")
    with SSHTunnelForwarder(
                ('15.236.248.127', 22),
                ssh_username='ubuntu',
                ssh_pkey=key,
                remote_bind_address=(HOST_AWS, 5432),
                local_bind_address=("127.0.0.1",)
            ) as server:
                
                server.start()
                print ('Server connected via SSH')

                #connect to PostgreSQL
                local_port = str(server.local_bind_port)
                engine = create_engine('postgresql://postgres:AWSRDSPG123@127.0.0.1:' + local_port +'/postgres')

                Session = sessionmaker(bind=engine)
                session = Session()
                
                print ('Database session created')
                print(session)
                Offres = session.execute("SELECT * FROM offre")
                for row in Offres:
                    print(row)
                    response_body = {
                        "name": row[1],
                        "type" : row[2],
                        "description": row[3],
                        "datedebut": row[4],
                        "duree": row[5],
                        "address": row[8],
                        "ville": row[9],          
                        "prix": row[11]
                    }
                print(response_body)
                return response_body
"""         client = paramiko.SSHClient()
            client.load_system_host_keys()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect(hostname='15.236.248.127',username=server.ssh_username, pkey=key)
            print ("client connected")
            stdin, stdout, stderr = client.exec_command('ls')
            print(stdout.read().decode())
            client.close()"""

##### Fournisseur Part #####
@app.route('/register_f', methods =["GET", "POST"])
def add_fournisseur():
        email = request.form.get('email')
        cursor.execute("SELECT email FROM fournisseur WHERE email='{}'".format(email))
        Users = cursor.fetchall()
        find_email = any(email in sublist for sublist in Users)
        if find_email:
            return abort(401, description="Email already used !")
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
            return redirect('/'), 301
        else:
            return abort(401, description="Failed to submit !")

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
        return redirect('/add_offer'), 301


@app.route('/delete_offer', methods=['GET', 'POST'])
def delete_offer():
    return

@app.route('/modify_offer', methods=['GET', 'POST'])
def modify_offer():
    return


if __name__ == "__main__":
    app.run(debug=True)