# TPC 1

Neste trabalho de casa era pedido para gerar um [dataset](https://github.com/chico2911/PRC2021/blop/main/TPC1/Ficheiro/dataset.json) JSON para, atravês deste gerar um ficheiro [turtle](https://github.com/chico2911/PRC2021/blop/main/TPC1/Ficheiro/ttlGenarateFromJson.ttl) com a ontologia criada na aula.

Para tal foi criado um pequeno programa em **pyhton** que lê o dataset, após abre um ficheiro turttle escrevendo lá o valor de head. Após, com recurso a vários ciclos for, são escritos cada objeto.
Para correr basta fazer:

```python
python3 json2ttl.py
```
