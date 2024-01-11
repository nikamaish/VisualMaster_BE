from flask import Flask, request, jsonify, session
from flask_pymongo import PyMongo
from flask_bcrypt import bcrypt
from flask_cors import CORS  # Import CORS from flask_cors
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)

app = Flask(__name__)
app.secret_key = 'jwt_secret_key'  # Set a secret key for session management
app.config['JWT_SECRET_KEY'] = 'pX~-ERh5AzgZ#Be3?W9^vnKu}Vs_D'
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']




# Configure MongoDB
app.config['MONGO_URI'] = 'mongodb://localhost:27017/Visual'
mongo = PyMongo(app)
# bcrypt = bcrypt(app)
jwt = JWTManager(app)

# Enable CORS for your app with specific origins
CORS(app)
jwt_blacklist = set()

@app.route('/signup', methods=['POST'])
def signup():
    print("Signup route accessed")
    data = request.get_json()
    username = data['username']
    password = data['password']

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Store the user in MongoDB (you should have a 'users' collection)
    users = mongo.db.User
    existing_user = users.find_one({'username': username})

    if existing_user:
        return jsonify({'message': 'User already exists'})

    users.insert_one({'username': username, 'password': hashed_password})
    return jsonify({'message': 'Signup successful'})

    # access_token = create_access_token(identity=username)
    # return jsonify({'message': 'Signup successful', 'access_token': access_token})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # Fetch the user from MongoDB (you should have a 'users' collection)
    users = mongo.db.User
    user = users.find_one({'username': username})

    if not user:
        return jsonify({'message': 'User not found'}), 401

    hashed_password = user['password']

    if bcrypt.checkpw(password.encode('utf-8'), hashed_password):
        access_token =  create_access_token(identity=username)
        return jsonify({'message': 'Login successful', 'access_token': access_token})
    else:
        return jsonify({'message': 'Login failed', 'error': 'Invalid credentials'}), 401
# Remove the /signup route or keep it for user registration

@app.route('/logout', methods=['GET'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    jwt_blacklist.add(jti)

    # print(f'Token added to blacklist: {jti}')
    return jsonify({'message': 'Logout successful'})


from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    jti = get_jwt()['jti']

    # Check if the token is in the blacklist
    if jti in jwt_blacklist:
        return jsonify({'message': 'Token has been revoked'}), 401
    
    return jsonify(logged_in_as=current_user), 200



# @app.route('/signout', methods=['GET'])
# def signout():
    
#     session.clear()
#     return jsonify({'message': 'Signout successful'})



if __name__ == '__main__':
    app.run(debug=True)
