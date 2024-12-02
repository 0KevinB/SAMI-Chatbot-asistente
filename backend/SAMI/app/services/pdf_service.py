import PyPDF2
from io import BytesIO

def extract_text_from_pdf(pdf_bytes):
    """
    Extrae texto de un archivo PDF.
    """
    pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
    text = ""

    for page in pdf_reader.pages:
        text += page.extract_text()

    return text
