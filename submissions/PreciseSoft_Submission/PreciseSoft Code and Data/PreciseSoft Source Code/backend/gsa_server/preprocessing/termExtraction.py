import pdftotext
import docx
import re
import logging


def textExtractDOCX(file):
    doc = docx.Document(file)
    paras = []
    all_paras = doc.paragraphs

    for para in all_paras:
        if (len(para.text) > 0):
            text = (para.text.encode('ascii', 'ignore')).decode("utf-8")
            text = text.replace('-', '').replace('"', '')
            paras.append(text)
        else:
            pass

    return paras


def textExtractPDF(file):
    re1 = "^[a-z]\.\ "
    re2 = "\([a-z]|[1-9]\)"
    re3 = "[i, v][i,v]*\."
    re4 = "^[0-9][0-9]*\."
    re5 = "^[0-9]\.[0-9]\ "
    reList = [re1, re4, re3]
    generic_re = re.compile('|'.join(reList))

    pdf = pdftotext.PDF(file)
    terms = []
    term = ""
    for i in pdf:
        for j in i.split('\n'):
            if re.match(generic_re, j):
                terms.append(term)
                term = ""
            term += j
    return terms


def textExtract(request):
    file = request.files['file']
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension == 'docx' or file_extension == 'doc':
        # DOC Code here
        return textExtractDOCX(file)
    elif file_extension == 'pdf':
        # PDF Code here
        return textExtractPDF(file)
    else:
        # Incorrect file format
        return False
