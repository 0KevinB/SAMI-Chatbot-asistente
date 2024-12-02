import firebase_admin
from firebase_admin import credentials, storage

def initialize_firebase():
    """
    Inicializa Firebase con las credenciales necesarias.
    """
    if not firebase_admin._apps:
        cred = credentials.Certificate("config/firebase_credentials.json")  # Ruta a tus credenciales
        firebase_admin.initialize_app(cred, {
            "storageBucket": "sammy-ae034.appspot.com"  # Nombre de tu bucket
        })

def get_bucket():
    """
    Devuelve el bucket de Firebase Storage.
    """
    initialize_firebase()
    return storage.bucket()
