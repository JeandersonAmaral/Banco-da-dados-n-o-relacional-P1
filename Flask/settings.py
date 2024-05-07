from flask import Flask
import os
import mysql.connector


config = {
    'user': 'root',
    'password': '12345678',
    'host': 'localhost',
    'database': 'mysql',
    'raise_on_warnings': True
}

app = Flask(__name__)
SECRET_KEY = os.environ.get('SECRET_KEY', '202e7fa41c6dca5b43a88ff0fd7b353b')


def get_db_connection():
    connection = mysql.connector.connect(**config)
    return connection


