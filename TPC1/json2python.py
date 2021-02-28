import json

with open("dataset.json", encoding='utf8') as f:
    data =json.load(f)

f = open("ttlGenarateFromJson.ttl", "w", encoding='utf8')
with open("header.txt", encoding='utf8') as head:
    header = head.read()

f.write(header)

#Escrevers as unidades curriculares
for uc in data['ucs']:
    text = "###  http://www.di.uminho.pt/prc2021/uc#"+ uc['id']+"\n"
    text += ':' + uc['id'] + " rdf:type owl:NamedIndividual\n                 :Unidade Curricular ;\n"
    text+= "         :anoLetivo \"" + uc['anoLetivo']  + "\" ;\n"
    text+= "         :designação \"" + uc['designacao'] + "\" .\n\n"
    f.write(text)

#Escrever Docentes
for professor in data["professores"]:
    text = "###  http://www.di.uminho.pt/prc2021/uc#" + professor['id'] + "\n"
    text += ':' + professor['id'] + " rdf:type owl:NamedIndividual\n                 :Professor ;\n"
    uc = professor['ensina'].split(',')
    i=0;
    for cadeira in uc:
        if(i==0):
            frase=cadeira;
            if(len(uc)>1):
                frase += " ,\n"
            else:
                frase += " ;\n"      
        else:
            frase+= "                 :"+ cadeira
            if(i==len(uc)-1):
                frase+= " ;\n"
            else:
                frase+= " ,\n"    
        i+=1        
    text+= "         :ensina :" + frase
    text+= "         :nome \"" + professor['nome'] + "\" .\n\n"
    f.write(text)

#Escrever Alunos
for aluno in data['alunos']:
    uc = aluno['frequenta'].split(',')
    i=0;
    for cadeira in uc:
        if(i==0):
            frase=cadeira;
            if(len(uc)>1):
                frase += " ,\n"
            else:
                frase += " ;\n"      
        else:
            frase+= "                    :"+ cadeira
            if(i==len(uc)-1):
                frase+= " ;\n"
            else:
                frase+= " ,\n"    
        i+=1         
    text = "###  http://www.di.uminho.pt/prc2021/uc#"+ aluno['id']+"\n"
    text += ':' + aluno['id'] + " rdf:type owl:NamedIndividual ;\n"
    text+= "         :frequenta :" + frase
    text+= "         :nome \"" + aluno['nome'] + "\" .\n\n"
    f.write(text)
    