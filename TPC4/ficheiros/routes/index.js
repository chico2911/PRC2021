var express = require('express');
var router = express.Router();
var axios = require('axios');
const { response } = require('express');

var prefixes = ` PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX : <http://www.daml.org/2003/01/periodictable/PeriodicTable#>
    prefix pt: <http://www.daml.org/2003/01/periodictable/PeriodicTable#>
`

const url = "http://localhost:7200/repositories/tabelaPeriodica?query="


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tabela Periódica' });
});

router.get('/elementos',function(req,res,next){
  var query = `SELECT ?s ?simb ?name ?anumber WHERE { ?s rdf:type pt:Element ; :symbol ?simb ; :name ?name ; :atomicNumber ?anumber.} ORDER BY (?anumber)`;
  var encoded = encodeURIComponent(prefixes + query);
  axios.get(url+encoded)
  .then((response => {
    elements = response.data.results.bindings.map(bind => {
      return({
          id: bind.s.value.split('#')[1],
          name: bind.name.value,
          simb: bind.simb.value,
          anumber: bind.anumber.value
      })
    });
    res.render('elementos', { title: 'Elementos',elementos:elements });
  }))

  
});

router.get('/grupos',function(req,res,next){
  var query = `SELECT ?s ?name ?number WHERE { ?s rdf:type pt:Group . OPTIONAL{ ?s :name ?name } . OPTIONAL{ ?s :number ?number } . } ORDER BY (?s)`;
  var encoded = encodeURIComponent(prefixes + query);
  axios.get(url + encoded)
      .then(response => {
        groups = response.data.results.bindings.map(bind => {
            return({
            id: bind.s.value.split('#')[1],
            number: (bind.number) ? bind.number.value : "No Info",
            name: (bind.name) ? bind.name.value : "No Info"
            })
        });
        res.render('grupos', { title: 'Grupos',grupos:groups });
      })
});

router.get('/periodos',function(req,res,next){
  var query = `SELECT ?s ?number WHERE { ?s rdf:type pt:Period . ?s :number ?number } ORDER BY (?number)`;
  encoded = encodeURIComponent(prefixes + query);
  axios.get(url + encoded)
      .then(response => {
        periods = response.data.results.bindings.map(bind => {
          return({
              id: bind.s.value.split('#')[1],
              number: bind.number.value +'º Periodo'
          })
        });
        res.render('periodos', { title: 'Tabela Periódica', periodo :periods});
      })

});

router.get('/elementos/:id',function(req,res,next){
  var query = 'SELECT DISTINCT ?anumber ?aweight ?casregid ?color ?name ?symbol ?block ?classi ?stastate ?group ?period WHERE {  pt:' + req.params.id +' ?p ?o ; :atomicNumber ?anumber ; :atomicWeight ?aweight ; :casRegistryID ?casregid ; :color ?color ; :name ?name ; :symbol ?symbol ; :block ?block ; :classification ?classi ; :standardState ?stastate ; :group ?group ; :period ?period . }'
  encoded = encodeURIComponent(prefixes + query);
  axios.get(url + encoded)
      .then(response => {
        element = response.data.results.bindings.map(bind => {
          return({
              anumber: bind.anumber.value,
              aweight: bind.aweight.value,
              casregid: bind.casregid.value,
              color: bind.color.value,
              name: bind.name.value,
              symbol: bind.symbol.value,
              block: bind.block.value.split('#')[1],
              classi: bind.classi.value.split('#')[1],
              stastate: bind.stastate.value.split('#')[1],
              group: bind.group.value.split('#')[1],
              period: bind.period.value.split('#')[1]
          })
        });
        res.render('elemento', { title: element[0].name, elem:element[0]});
      })
  
});

router.get('/grupos/:id',function(req,res,next){
  var query = 'SELECT * WHERE { pt:' + req.params.id + ' ?p ?o . }';
  var encoded = encodeURIComponent(prefixes + query);
  axios.get(url+encoded)
    .then(response=>{
      group = response.data.results.bindings.map(bind=>{
        return({p: bind.p.value.split('#')[1],o: (bind.o.type == 'literal') ? bind.o.value : bind.o.value.split('#')[1]})
      })
      var number = 'No Info'
      var name = 'No Info'
      group.forEach(g => {
          if (g.p == 'number') {
              number = g.o
          }
          if (g.p == 'name') {
              name = g.o
          }
      });
      title = number=='No Info' ? number : name
      console.log(group)
      res.render('grupo', {title: title+' Grupo',group: group});
    })
});

router.get('/periodos/:id',function(req,res,next){
  var query = 'SELECT distinct ?name ?number WHERE { pt:' + req.params.id + ' ?p ?o; :number ?number . pt:' + req.params.id + ' :element ?name }';
  var encoded = encodeURIComponent(prefixes + query);
  axios.get(url+encoded)
    .then(response=>{
      elements = response.data.results.bindings.map(bind => {
        return({
            
            name: bind.name.value.split('#')[1]
        })
      });
      number = response.data.results.bindings[0].number.value;
      res.render('periodo', { title: number + 'º Periodo',num:number, elems:elements });
    })

  
});

module.exports = router;
