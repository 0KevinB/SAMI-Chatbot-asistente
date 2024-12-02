from SAMI.firebase_config import get_bucket

def download_pdf(file_name):
    """
    Descarga un archivo PDF desde Firebase Storage.
    """
    bucket = get_bucket()
    blob = bucket.blob(file_name)

    if not blob.exists():
        raise FileNotFoundError(f"El archivo {file_name} no existe en Firebase Storage.")

    return blob.download_as_bytes()